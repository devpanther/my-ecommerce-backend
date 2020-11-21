const { verify } = require("jsonwebtoken");

module.exports.validateAccessToken = async (token) => {
  try {
    return await verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  } catch {
    return null;
  }
};

module.exports.validateRefreshToken = async (token) => {
  try {
    return await verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch {
    return null;
  }
};
