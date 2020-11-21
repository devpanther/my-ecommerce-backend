const User = require("../models/user");
const { UserType } = require("../objectTypes");

module.exports.user = {
  type: UserType,
  async resolve(parent, args, { req }) {
    if (req.user && req.user._id) return await User.findById(req.user._id);
    return null;
  },
};
