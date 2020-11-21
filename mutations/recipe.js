const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLError,
  GraphQLBoolean,
} = require("graphql");
const Recipe = require("../models/recipe");
const User = require("../models/user");

module.exports.toggleLike = {
  type: GraphQLString,
  args: {
    recipeId: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, { recipeId }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let recipe = await Recipe.findById(recipeId);
    let user = await User.findById(req.user._id);

    if (!recipe.likes.includes(req.user._id)) {
      // Add Like
      recipe.likes = [req.user._id, ...recipe.likes];
      user.likes = [recipeId, ...user.likes];
    } else {
      // Remove Like
      recipe.likes = recipe.likes.filter((like) => like != req.user._id);
      user.likes = user.likes.filter((like) => like != recipeId);
    }

    await recipe.save();
    await user.save();
    return "Success";
  },
};

module.exports.toggleCart = {
  type: GraphQLString,
  args: {
    recipeId: { type: new GraphQLNonNull(GraphQLID) },
    add: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
  async resolve(parent, { recipeId, add }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let user = await User.findById(req.user._id);
    if (add) {
      // Add to Cart
      user.carts = [recipeId, ...user.carts];
    } else {
      // Remove from Cart
      let carts = [...user.carts];
      let index = carts.findIndex((item) => item == recipeId);
      if (index > -1) {
        carts.splice(index, 1);
        user.carts = carts;
      }
    }

    await user.save();
    return "Success";
  },
};

module.exports.deleteCart = {
  type: GraphQLString,
  args: { recipeId: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { recipeId }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let user = await User.findById(req.user._id);
    user.carts = user.carts.filter((item) => item != recipeId);

    await user.save();
    return "Success";
  },
};
