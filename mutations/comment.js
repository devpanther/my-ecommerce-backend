const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLError,
  GraphQLID,
} = require("graphql");
const { Types } = require("mongoose");
const Comment = require("../models/comment");
const Recipe = require("../models/recipe");
const User = require("../models/user");

module.exports.addComment = {
  type: GraphQLString,
  args: {
    recipeId: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(parent, { recipeId, text, rating }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let user = await User.findById(req.user._id);
    if (!user) return new GraphQLError("Recipe does not exist");

    let recipe = await Recipe.findById(recipeId);
    if (!recipe) return new GraphQLError("Recipe does not exist");

    // Check if a user has order the specific recipe
    const userOrders = user.orders.map((item) => item.toString());
    const recipeOrders = recipe.orders.map((item) => item.toString());
    const found = recipeOrders.some((id) => userOrders.includes(id));

    if (!found)
      return new GraphQLError("Please place an order before commenting");

    if (rating < 0 || rating > 5 || !text)
      return new GraphQLError("Invalid Input");

    // User can add a comment
    const comment = new Comment({
      text,
      rating,
      recipeId,
      userId: req.user._id,
    });

    recipe.comments = [comment._id, ...recipe.comments];
    user.comments = [comment._id, ...user.comments];
    await user.save();
    await recipe.save();
    await comment.save();

    return "Success";
  },
};

module.exports.updateComment = {
  type: GraphQLString,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
    rating: { type: new GraphQLNonNull(GraphQLInt) },
  },
  async resolve(parent, { _id, rating, text }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    if (rating < 0 || rating > 5 || !text)
      return new GraphQLError("Invalid Input");

    let comment = await Comment.findById(_id);
    if (!comment) return new GraphQLError("Comment does not exist");

    await Comment.findByIdAndUpdate(_id, { text, rating });
    return "Success";
  },
};

module.exports.deleteComment = {
  type: GraphQLString,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    let comment = await Comment.findById(_id);
    if (!comment) return new GraphQLError("Comment does not exist");

    await Comment.findByIdAndDelete(_id);
    return "Success";
  },
};
