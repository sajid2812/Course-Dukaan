const { z } = require("zod");
const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.js");
const Purchase = require("./schema.js");

router.post("/", auth, async (req, res) => {
  try {
    const requiredBody = z.object({
      course: z.string(),
      paymentMode: z.string(),
      amount: z.number().max(10),
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

module.exports = router;
