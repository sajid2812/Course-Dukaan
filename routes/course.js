const { Router } = require("express");
const { z } = require("zod");

const { userMiddleware } = require("../middlewares/user.js");
const Purchase = require("../schemas/purchase.js");
const Course = require("../schemas/course.js");

const router = Router();

router.post("/purchase", userMiddleware, async (req, res) => {
  try {
    const requiredBody = z.object({
      course: z.string(),
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

router.get("/preview", async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        title: 1,
        description: 1,
        price: 1,
        imageUrl: 1,
        creator: 1,
      }
    ).populate("creator", "name");
    return res.status(200).json(courses);
  } catch (e) {
    return res.status(400).json({
      message: "Fetching course details failed",
    });
  }
});

module.exports = router;
