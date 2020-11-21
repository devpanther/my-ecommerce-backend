const { GraphQLNonNull, GraphQLString, GraphQLError } = require("graphql");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Types } = require("mongoose");
const User = require("../models/user");
const { UserType } = require("../objectTypes");
const { sendMail } = require("../utils/mail");
const { validateOnRegister } = require("../utils/validation");
const verifyToken = require("../utils/verifyToken");
const setTokens = require("../utils/setTokens");
const tokenCookies = require("../utils/tokenCookies");
const { createCustomer } = require("../stripe/customer");
const { cookieOptions } = require("../utils/cookieOptions");

module.exports.register = {
  type: UserType,
  args: {
    firstname: { type: new GraphQLNonNull(GraphQLString) },
    lastname: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args) {
    let error = validateOnRegister(args);
    if (error) return error;

    let user = await User.findOne({ email: args.email.toLowerCase() });
    if (user) return new GraphQLError("Email has been registered");

    args.password = await bcrypt.hash(args.password, 12);
    user = await new User({ ...args });

    const customer = await createCustomer(user);
    if (!customer) return new GraphQLError("User could not be created");

    user.customerId = customer.id;
    await user.save();
    return _.pick(user, ["_id", "email"]);
  },
};

module.exports.verifyEmail = {
  type: GraphQLString,
  args: {
    _id: { type: GraphQLString },
    email: { type: GraphQLString },
  },
  async resolve(parent, { email, _id }) {
    let user;
    if (_id) {
      const valid = Types.ObjectId.isValid(_id);
      if (!valid) return new GraphQLError("Invalid Object ID");

      user = await User.findById(_id);
      if (!user) return new GraphQLError("User does not exist");
    } else if (email) {
      user = await User.findOne({ email });
      if (!user) return new GraphQLError("User does not exist");
    } else {
      return new GraphQLError("User does not exist");
    }

    const token = await user.generateEmailToken();
    const mailData = {
      firstname: user.firstname,
      email: user.email,
      templateId: process.env.ACTIVATE_EMAIL_ID,
      link: `${process.env.FRONTEND_ENDPOINT}/verified-email/${token}`,
    };
    await sendMail(mailData);
    return "Success";
  },
};

module.exports.sendResetToken = {
  type: GraphQLString,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, { email }) {
    const user = await User.findOne({ email });
    if (!user) return new GraphQLError("User does not exist");

    const token = await user.generateEmailToken();
    const mailData = {
      firstname: user.firstname,
      email: user.email,
      templateId: process.env.PASSWORD_RESET_ID,
      link: `${process.env.FRONTEND_ENDPOINT}/password-reset/`,
      token,
    };
    await sendMail(mailData);
    return "Success";
  },
};

module.exports.resetPassword = {
  type: GraphQLString,
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString },
  },
  async resolve(parent, { token, password }) {
    let user;

    // When the user hits the password reset route with token
    if (!password) {
      user = await verifyToken(token);
      if (!user) return new GraphQLError("Invalid or Expired Token");
      return "Success";
    }

    // When the user submits his or her password
    user = await verifyToken(token);
    if (!user) return new GraphQLError("Invalid or Expired Token");

    const valid = Types.ObjectId.isValid(user._id);
    if (!valid) return new GraphQLError("Invalid Object ID");

    user = await User.findById(user._id);
    if (!user) return new GraphQLError("User does not exist");

    user.password = await bcrypt.hash(password, 12);
    await user.save();
    return "Success";
  },
};

module.exports.activateEmail = {
  type: GraphQLString,
  args: {
    token: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, { token }) {
    // When the user hits the activate email route with token
    let user = await verifyToken(token);

    if (!user) return new GraphQLError("Invalid or Expired Token");

    const valid = Types.ObjectId.isValid(user._id);
    if (!valid) return new GraphQLError("Invalid Object ID");

    user = await User.findById(user._id);
    if (!user) return new GraphQLError("User does not exist");

    user.isActivated = true;
    await user.save();
    return "Success";
  },
};

module.exports.login = {
  type: GraphQLString,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { res }) {
    let user = await User.findOne({ email: args.email });
    if (!user) return new GraphQLError("Invalid Email or Password");

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) return new GraphQLError("Invalid Email or Password");

    if (!user.isActivated) return new GraphQLError("Account is not verified");

    const tokens = await setTokens(user);
    const cookies = tokenCookies(tokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);

    return "Success";
  },
};

module.exports.logout = {
  type: GraphQLString,
  async resolve(parent, args, { res }) {
    // Clear cookies with the same options used to create it
    res.clearCookie("access", cookieOptions);
    res.clearCookie("refresh", cookieOptions);
    return true;
  },
};
