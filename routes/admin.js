require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { z } = require("zod");

const { adminMiddleware } = require("../middlewares/admin.js");
const Admin = require("../schemas/admin.js");
const Course = require("../schemas/course.js");

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
    await Admin.create({
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
      message: "Admin already exists",
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
    const admin = await Admin.findOne({
      email: email,
    });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const passwordMatched = await bcrypt.compare(password, admin.password);
    if (!passwordMatched) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign(
      {
        _id: admin._id,
      },
      process.env.ADMIN_JWT_SECRET
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

router.post("/course", adminMiddleware, async (req, res) => {
  try {
    const { title, description, price, imageUrl } = req.body;
    const requiredBody = z.object({
      title: z.string().min(3).max(30),
      description: z.string().min(3).max(1000),
      price: z.number().max(1000000),
      imageUrl: z.string(),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    const course = await Course.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      creator: req.user._id,
    });
    return res.status(200).json({
      message: "Course has been created successfully",
      courseId: course._id,
    });
  } catch (e) {
    return res.status(400).json({
      message: "Course creation failed",
    });
  }
});

router.put("/course", adminMiddleware, async (req, res) => {
  try {
    const requiredBody = z.object({
      title: z.string().min(3).max(30),
      description: z.string().min(3).max(1000),
      price: z.number().max(1000000),
      imageUrl: z.string(),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    await Course.updateOne(
      {
        _id: req.body._id,
        creator: req.user._id,
      },
      {
        $set: req.body,
      }
    );
    return res.status(200).json({
      message: "Course has been updated successfully",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Course updation failed",
    });
  }
});

router.get("/course/list", adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find(
      { creator: req.user._id },
      {
        title: 1,
        description: 1,
        price: 1,
        imageUrl: 1,
      }
    );
    return res.status(200).json(courses);
  } catch (e) {
    return res.status(400).json({
      message: "Fetching courses list failed",
    });
  }
});

router.delete("/course/:id", adminMiddleware, async (req, res) => {
  try {
    await Course.deleteOne({
      _id: req.params.id,
    });
    return res.status(200).json({
      message: "Course has been deleted successfully",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Course deletion failed",
    });
  }
});

module.exports = router;
