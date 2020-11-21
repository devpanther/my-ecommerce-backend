const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
  GraphQLID,
} = require("graphql");
const { Types } = require("mongoose");
const Address = require("../models/address");

module.exports.addAddress = {
  type: GraphQLString,
  args: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    await Address.create({ ...args, userId: req.user._id });

    return "Success";
  },
};

module.exports.updateAddress = {
  type: GraphQLString,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    address: { type: new GraphQLNonNull(GraphQLString) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    state: { type: new GraphQLNonNull(GraphQLString) },
    postalCode: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(args._id))
      return new GraphQLError("Invalid Object ID");

    let address = await Address.findById(args._id);
    if (!address) return new GraphQLError("Address does not exist");

    await Address.findByIdAndUpdate(args._id, args);

    return "Success";
  },
};

module.exports.deleteAddress = {
  type: GraphQLString,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    let address = await Address.findById(_id);
    if (!address) return new GraphQLError("Address does not exist");

    await Address.findByIdAndDelete(_id);
    return "Success";
  },
};
