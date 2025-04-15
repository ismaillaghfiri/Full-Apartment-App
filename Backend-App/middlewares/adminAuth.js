const ErrorResponse = require("../utils/errorResponse");

const adminAuth = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return next(
        new ErrorResponse("Not authorized to access this route", 403)
      );
    }
    next();
  } catch (error) {
    next(new ErrorResponse("Not authorized to access this route", 403));
  }
};

module.exports = adminAuth;
