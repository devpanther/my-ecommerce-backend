const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLError,
  GraphQLID,
} = require("graphql");
const { Types } = require("mongoose");
const Payment = require("../models/payment");
const {
  createSetupIntent,
  detachPaymentMethod,
  addMetaData,
} = require("../stripe/card");

module.exports.getSecret = {
  type: GraphQLString,
  async resolve(parent, args, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    /* Create a setup intent and send the client_secret to the frontend.
      The frontend uses the client_secret to confirm card setup sending
      the card details directly to stripe without touching the server.
    */
    const setup = await createSetupIntent(req.user.customerId);
    if (typeof setup !== "object") return new GraphQLError(setup);

    return setup.client_secret;
  },
};

module.exports.addPayment = {
  type: GraphQLString,
  args: { cardId: { type: new GraphQLNonNull(GraphQLString) } },
  async resolve(parent, { cardId }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    /* Create a relationship between the payment method and the payment document,
      store a reference of the payment method for future use.
    */
    let payment = new Payment({ cardId, customerId: req.user.customerId });

    const paymentMethod = await addMetaData(cardId, payment._id.toString());
    if (typeof paymentMethod !== "object")
      return new GraphQLError(paymentMethod);

    await payment.save();

    return "Success";
  },
};

module.exports.deletePayment = {
  type: GraphQLString,
  args: { _id: { type: new GraphQLNonNull(GraphQLID) } },
  async resolve(parent, { _id }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    if (!Types.ObjectId.isValid(_id))
      return new GraphQLError("Invalid Object ID");

    let payment = await Payment.findById(_id);
    if (!payment) return new GraphQLError("Payment does not exist");

    const deleted = await detachPaymentMethod(payment.cardId);
    if (typeof deleted !== "object") return new GraphQLError(deleted);

    payment = await Payment.findByIdAndDelete(_id);
    return "Success";
  },
};
