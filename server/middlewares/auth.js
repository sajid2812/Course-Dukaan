require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next) {
  try {
    if (!req.headers.token) {
      return res.status(401).json({
        message: "Invalid Token.",
      });
    }
    const decodedInfo = jwt.verify(req.headers.token, JWT_SECRET);
    req.user = decodedInfo;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid Token.",
    });
  }
}

module.exports = { auth };
