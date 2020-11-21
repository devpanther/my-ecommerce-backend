const { sign } = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (user) => {
  await User.findByIdAndUpdate(user._id, { tokenCount: user.tokenCount + 1 });

  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const oneMinute = 60 * 1 * 1000;

  const accessUser = {
    _id: user._id,
    customerId: user.customerId,
  };
  const accessToken = await sign(
    { user: accessUser },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: oneMinute,
    }
  );

  const refreshUser = {
    _id: user._id,
    customerId: user.customerId,
    count: user.tokenCount + 1,
  };
  const refreshToken = await sign(
    { user: refreshUser },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    {
      expiresIn: fiveDays,
    }
  );

  return { accessToken, refreshToken };
};
