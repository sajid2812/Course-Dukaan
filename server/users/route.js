const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.post("/signup", (req, res) => {});

router.post("/login", (req, res) => {});

router.post("/purchase", auth, (req, res) => {});

router.get("/list", auth, (req, res) => {});

module.exports = router;
