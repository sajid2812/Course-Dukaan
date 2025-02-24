const { z } = require("zod");
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.js");
const Course = require("./schema.js");

router.post("/", auth, async (req, res) => {
  try {
    const requiredBody = z.object({
      title: z.string().min(3).max(30),
      price: z.number().max(1000000),
      duration: z.number(),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    await Course.create({
      title: req.body.title,
      price: req.body.price,
      duration: req.body.duration,
      instructor: req.user._id,
    });
    return res.status(200).json({
      message: "Course has been created successfully",
    });
  } catch (e) {
    return res.status(400).json({
      message: "Course creation failed",
    });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const course = await Course.findOne(
      {
        _id: req.params.id,
      },
      {
        title: 1,
        price: 1,
        duration: 1,
        instructor: 1,
      }
    ).populate("instructor", "name");
    return res.status(200).json(course);
  } catch (e) {
    return res.status(400).json({
      message: "Fetching course details failed",
    });
  }
});

router.delete("/:id", auth, async (req, res) => {
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

router.put("/", auth, async (req, res) => {
  try {
    const requiredBody = z.object({
      _id: z.string(),
      title: z.string().min(3).max(30),
      price: z.number().max(1000000),
      duration: z.number(),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    await Course.findOneAndUpdate(
      {
        _id: req.body._id,
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

router.get("/list", auth, async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        title: 1,
        price: 1,
        duration: 1,
        instructor: 1,
      }
    ).populate("instructor", "name");
    return res.status(200).json(courses);
  } catch (e) {
    return res.status(400).json({
      message: "Fetching courses list failed",
    });
  }
});

module.exports = router;
