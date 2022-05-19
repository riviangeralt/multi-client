const jsonwebtoken = require("jsonwebtoken");

exports.isAuthenticated = (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided",
        status: "error",
      });
    }
    const verified = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "error",
    });
  }
};
