const { GraphQLSchema } = require("graphql");
const Mutation = require("../mutations");
const RootQuery = require("../queries");

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
