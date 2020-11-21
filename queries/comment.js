const { GraphQLNonNull, GraphQLID, GraphQLList } = require("graphql");
const { Types } = require("mongoose");
const Comment = require("../models/comment");
const { CommentType } = require("../objectTypes");

module.exports.comment = {
  type: CommentType,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    return await Comment.findById(_id);
  },
};

module.exports.comments = {
  type: new GraphQLList(CommentType),
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    return await Comment.find({ userId: req.user._id }).sort("-updatedAt");
  },
};
