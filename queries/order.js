const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLError,
  GraphQLList,
} = require("graphql");
const Order = require("../models/order");
const { OrderType, ChargeType } = require("../objectTypes");
const { getPayments } = require("../stripe/payment");
const { getPaymentMethods } = require("../stripe/card");

module.exports.order = {
  type: OrderType,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    return Order.findById(args._id);
  },
};

module.exports.orders = {
  type: new GraphQLList(ChargeType),
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let paymentMethods = await getPaymentMethods(req.user.customerId);
    let charges = await getPayments(req.user.customerId);
    if (typeof charges === "string") return new GraphQLError(charges);

    return charges.map((charge) => {
      let paymentMethod = paymentMethods.filter(
        (card) => card.id === charge.payment_method
      )[0];

      if (paymentMethod) {
        let source = {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
        };

        charge.orderId = charge.metadata.orderId;
        charge.source = source;
        return charge;
      }
      return {};
    });
  },
};
