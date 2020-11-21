const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLError,
} = require("graphql");
const { Types } = require("mongoose");
const Payment = require("../models/payment");
const { CardType } = require("../objectTypes");
const { getPaymentMethods, getPaymentMethod } = require("../stripe/card");

module.exports.payment = {
  type: CardType,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    let payment = await Payment.findById(_id);
    if (!payment) return new GraphQLError("Payment does not exist");

    const card = await getPaymentMethod(payment.cardId);
    if (typeof card === "string") return new GraphQLError(card);

    return { cardId: card.id };
  },
};

module.exports.payments = {
  type: new GraphQLList(CardType),
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    const cards = await getPaymentMethods(req.user.customerId);
    if (typeof cards !== "object") return new GraphQLError(cards);

    return cards.map((item) => {
      item._id = item.metadata._id;
      item.brand = item.card.brand;
      item.cardId = item.id;
      item.exp_month = item.card.exp_month;
      item.exp_year = item.card.exp_year;
      item.name = item.billing_details.name;
      item.last4 = item.card.last4;
      return item;
    });
  },
};
