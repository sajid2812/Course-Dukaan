const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const Admin = require("./schema.js");

router.post("/signup", (req, res) => {});

router.post("/login", (req, res) => {});

router.post("/create", auth, (req, res) => {});

router.delete("/:courseId", auth, (req, res) => {});

router.put("/:courseId", auth, (req, res) => {});

module.exports = router;
