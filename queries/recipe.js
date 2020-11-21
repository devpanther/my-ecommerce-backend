const {
  GraphQLError,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
} = require("graphql");
const { Types } = require("mongoose");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const { RecipeType } = require("../objectTypes");
const { calculateRating } = require("../utils/helpers");

module.exports.recipe = {
  type: RecipeType,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }) {
    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");
    let recipe = Recipe.findById(_id);
    if (!recipe) return new GraphQLError("Recipe does not exist");
    return recipe;
  },
};

module.exports.recipesByCategory = {
  type: new GraphQLList(RecipeType),
  args: {
    title: { type: GraphQLString },
    veryPopular: { type: GraphQLBoolean },
    count: { type: GraphQLInt },
    price: { type: GraphQLInt },
    _id: { type: GraphQLID },
    liked: { type: GraphQLBoolean },
    cart: { type: GraphQLBoolean },
  },
  async resolve(
    _,
    { title, veryPopular, price, count, liked, cart, rating },
    { req }
  ) {
    let recipes;
    // User's Cart
    if (req.user && req.user._id && cart) {
      let user = await User.findById(req.user._id);
      if (user) {
        let carts = [...new Set(user.carts)];
        recipes = await Recipe.find({ _id: { $in: carts } });
        return recipes;
      }
    }

    // Favourite Recipes
    if (req.user && req.user._id && liked) {
      return await Recipe.find({ likes: req.user._id });
    }

    if (title && price)
      return await Recipe.find({
        name: { $regex: title, $options: "i" },
        pricePerServing: { $lt: price },
      }).limit(count || 10);

    if (title)
      return await Recipe.find({
        name: { $regex: title, $options: "i" },
      }).limit(count || 20);

    let promise;
    if (veryPopular) {
      promise = new Promise((resolve, reject) => {
        Recipe.findRandom(
          { veryPopular },
          {},
          { limit: count || 10 },
          function (err, docs) {
            return err ? reject(err) : resolve(docs);
          }
        );
      });
      return await promise;
    }

    // Suggested Prices
    promise = new Promise((resolve, reject) => {
      Recipe.findRandom({}, {}, { limit: 15 }, function (err, docs) {
        return err ? reject(err) : resolve(docs);
      });
    });
    return await promise;
  },
};
