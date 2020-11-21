const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLError,
} = require("graphql");
const { Types } = require("mongoose");
const Address = require("../models/address");
const { AddressType } = require("../objectTypes");

module.exports.address = {
  type: AddressType,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    const address = await Address.findById(_id);

    if (!address) return new GraphQLError("Address does not exist");

    return address;
  },
};

module.exports.addresses = {
  type: new GraphQLList(AddressType),
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    return await Address.find({ userId: req.user._id }).sort("-updatedAt");
  },
};
