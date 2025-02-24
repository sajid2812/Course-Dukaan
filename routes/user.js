require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { z } = require("zod");

const { userMiddleware } = require("../middlewares/user.js");
const User = require("../schemas/user.js");
const Purchase = require("../schemas/purchase.js");

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const requiredBody = z.object({
      firstName: z.string().min(3).max(30),
      lastName: z.string().min(3).max(30),
      email: z.string().min(3).max(50).email(),
      password: z.string().min(3).max(20),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "Signup Successfull.",
    });
  } catch (e) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const requiredBody = z.object({
      email: z.string().min(3).max(50).email(),
      password: z.string().min(3).max(20),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.USER_JWT_SECRET
    );
    // Do cookie logic
    return res.status(200).json({
      token,
    });
  } catch (e) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
});

router.get("/purchases", userMiddleware, async (req, res) => {
  try {
    const purchases = await Purchase.find(
      {
        user: req.user._id,
      },
      {
        course: 1,
      }
    ).populate("course", "title");
    return res.status(200).json(purchases);
  } catch (e) {
    return res.status(400).json({
      message: "Fetching purchases list failed",
    });
  }
});

module.exports = router;
