require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { z } = require("zod");

const { auth } = require("../middlewares/auth.js");
const Admin = require("../admin/schema.js");

router.post("/signup", async (req, res) => {
  try {
    const requiredBody = z.object({
      username: z.string().min(3).max(30),
      name: z.string().min(3).max(50),
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
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    await Admin.create({
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    return res.status(200).json({
      message: "Signup Successfull.",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Admin already exists",
    });
  }
});

router.post("/login", async (req, res) => {
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
  const user = await Admin.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
  const passwordMatched = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!passwordMatched) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
  const token = jwt.sign(
    {
      _id: user._id,
      role: "Admin",
    },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    token,
  });
});

const router = Router();

module.exports = { router };
