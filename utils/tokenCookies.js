const { cookieOptions } = require("./cookieOptions");

module.exports = ({ accessToken, refreshToken }) => {
  return {
    access: ["access", accessToken, cookieOptions],
    refresh: ["refresh", refreshToken, cookieOptions],
  };
};
