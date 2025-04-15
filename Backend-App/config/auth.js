const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ _id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
