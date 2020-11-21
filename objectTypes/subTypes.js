const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLFloat,
} = require("graphql");
const GraphQLLong = require("graphql-type-long");

const NutrientType = new GraphQLObjectType({
  name: "Nutrient",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    unit: { type: GraphQLString },
  }),
});

const CardType = new GraphQLObjectType({
  name: "Payment",
  fields: () => ({
    _id: { type: GraphQLID }, // From the database
    type: { type: GraphQLString },
    brand: { type: GraphQLString },
    cardId: { type: GraphQLString }, // From stripe
    created: { type: GraphQLLong },
    customer: { type: GraphQLString },
    exp_month: { type: GraphQLInt },
    exp_year: { type: GraphQLInt },
    name: { type: GraphQLString },
    last4: { type: GraphQLString },
  }),
});

const ChargeType = new GraphQLObjectType({
  name: "Charge",
  fields: () => ({
    id: { type: GraphQLString },
    orderId: { type: GraphQLID },
    description: { type: GraphQLString },
    amount: { type: GraphQLFloat },
    customer: { type: GraphQLString },
    source: { type: CardType },
    created: { type: GraphQLLong },
    payment_method: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    address: { type: GraphQLString },
    country: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

module.exports = {
  NutrientType,
  CardType,
  ChargeType,
  AddressType,
};
