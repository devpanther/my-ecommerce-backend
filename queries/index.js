const { GraphQLObjectType } = require("graphql");
const { address, addresses } = require("./address");
const { comment } = require("./comment");
const { order, orders } = require("./order");
const { recipe, recipesByCategory } = require("./recipe");
const { payment, payments } = require("./payment");
const { user } = require("./user");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: () => ({
    address,
    addresses,
    payment,
    user,
    comment,
    order,
    orders,
    payments,
    recipe,
    recipesByCategory,
  }),
});

module.exports = RootQuery;
