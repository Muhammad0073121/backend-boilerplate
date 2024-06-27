const jwt = require("jsonwebtoken");
const { Token } = require("../models/token");

async function auth(req, res, next) {
  let authToken = req?.headers?.authorization?.split(" ")[1];
  if (!authToken) {
    res.status(401).send("Access denied, no token provided");
  } else {
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_PRIVATE_KEY);
      if (decoded) {
        req.userAuth = decoded;
      }
      const findToken = await Token.findOne({
        user: req.userAuth._id,
        token: authToken,
      });
      if (findToken) {
        next();
      } else {
        return res.status(401).send("Session Expired.");
      }
    } catch (ex) {
      if (ex instanceof jwt.TokenExpiredError) {
        return res.status(401).send("Token expired. Please log in again.");
      } else if (ex instanceof jwt.JsonWebTokenError) {
        return res.status(401).send("Invalid token.");
      } else {
        return res.status(500).send("Internal server error.");
      }
    }
  }
}

module.exports = auth;
