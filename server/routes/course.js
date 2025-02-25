const { Router } = require("express");
const { z } = require("zod");

const { auth } = require("../middlewares/auth.js");
const Course = require("../schemas/course.js");

const router = Router();

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

router.post("/purchase", auth, async (req, res) => {
  try {
    const requiredBody = z.object({
      course: z.string(),
      paymentMode: z.string(),
      amount: z.number().max(1000000),
    });
    const { success, error } = requiredBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Incorrect Input Format",
        error: error,
      });
    }
    await Purchase.create({
      course: req.body.course,
      user: req.user._id,
      date: new Date(),
      paymentMode: req.body.paymentMode,
      amount: req.body.amount,
    });
    return res
      .status(200)
      .json({ message: "Course has been purchased successfully" });
  } catch (e) {
    return res.status(400).json({
      message: "Course purchase failed",
    });
  }
});

module.exports = { router };
