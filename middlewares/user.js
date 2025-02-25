require("dotenv").config();
const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  try {
    if (!req.headers.token) {
      return res.status(401).json({
        message: "Invalid Token.",
      });
    }
    const decodedInfo = jwt.verify(
      req.headers.token,
      process.env.USER_JWT_SECRET
    );
    req.user = decodedInfo;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Invalid Token.",
    });
  }
}

module.exports = { userMiddleware };
