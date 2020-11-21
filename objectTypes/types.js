const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
} = require("graphql");
const GraphQLDateTime = require("graphql-type-datetime");
const Comment = require("../models/comment");
const Order = require("../models/order");
const Recipe = require("../models/recipe");
const User = require("../models/user");
const { NutrientType } = require("./subTypes");

const RecipeType = new GraphQLObjectType({
  name: "Recipe",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    nutrients: { type: new GraphQLList(NutrientType) },
    pricePerServing: { type: GraphQLFloat },
    likes: { type: new GraphQLList(GraphQLString) },
    cuisines: { type: new GraphQLList(GraphQLString) },
    dishTypes: { type: new GraphQLList(GraphQLString) },
    diets: { type: new GraphQLList(GraphQLString) },
    orders: {
      type: new GraphQLList(OrderType),
      async resolve(parent) {
        return await Order.find({ recipes: parent._id }).sort("-updatedAt");
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent) {
        return await Comment.find({ recipeId: parent._id }).sort("-updatedAt");
      },
    },
    veryPopular: { type: GraphQLBoolean },
    gluttenFree: { type: GraphQLBoolean },
    dairyFree: { type: GraphQLBoolean },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    _id: { type: GraphQLID },
    firstname: { type: GraphQLString },
    lastname: { type: GraphQLString },
    email: { type: GraphQLString },
    isAdmin: { type: GraphQLBoolean },
    customerId: { type: GraphQLString },
    tokenCount: { type: GraphQLInt },
    carts: { type: new GraphQLList(GraphQLString) },
    likes: {
      type: new GraphQLList(RecipeType),
      async resolve(parent) {
        return await Recipe.find({ likes: parent._id });
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      async resolve(parent) {
        return await Order.find({ userId: parent._id });
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      async resolve(parent) {
        return await Comment.find({ userId: parent._id }).sort("-updatedAt");
      },
    },
  }),
});

const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    _id: { type: GraphQLID },
    cost: { type: GraphQLFloat },
    recipes: {
      type: new GraphQLList(RecipeType),
      async resolve(parent) {
        return await Recipe.findOne({ orders: parent._id });
      },
    },
    userId: {
      type: UserType,
      async resolve(parent) {
        return await User.findOne({ orders: parent._id });
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    _id: { type: GraphQLID },
    text: { type: GraphQLString },
    rating: { type: GraphQLInt },
    recipeId: {
      type: RecipeType,
      async resolve(parent) {
        return await Recipe.findOne({ comments: parent._id });
      },
    },
    userId: {
      type: UserType,
      async resolve(parent) {
        return await User.findOne({ comments: parent._id });
      },
    },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

module.exports = {
  RecipeType,
  UserType,
  OrderType,
  CommentType,
};
