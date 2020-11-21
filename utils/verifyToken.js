const jwt = require("jsonwebtoken");

const verifyToken = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    return decoded;
  } catch (ex) {
    return null;
  }
};

module.exports = verifyToken;
