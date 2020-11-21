const {
  validateAccessToken,
  validateRefreshToken,
} = require("../utils/validateToken");
const User = require("../models/user");
const setTokens = require("../utils/setTokens");
const tokenCookies = require("../utils/tokenCookies");
const { cookieOptions } = require("../utils/cookieOptions");

module.exports = async (req, res, next) => {
  const refreshToken = req.cookies["refresh"];
  const accessToken = req.cookies["access"];
  if (!accessToken && !refreshToken) return next();

  const decodedAccessToken = await validateAccessToken(accessToken);
  if (decodedAccessToken && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    return next();
  }

  const decodedRefreshToken = await validateRefreshToken(refreshToken);
  if (decodedRefreshToken && decodedRefreshToken.user) {
    // valid refresh token
    const user = await User.findById(decodedRefreshToken.user._id);

    if (!user || user.tokenCount !== decodedRefreshToken.user.count) {
      // Remove Cookies if token not valid
      res.clearCookie("access", cookieOptions);
      res.clearCookie("refresh", cookieOptions);
      return next();
    }
    const userTokens = await setTokens(user);
    req.user = decodedRefreshToken.user;
    // update the cookies with new tokens
    const cookies = tokenCookies(userTokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);
    return next();
  }

  next();
};
