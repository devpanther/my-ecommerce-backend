const stripe = require("./index");

module.exports.createSetupIntent = async (customerId) => {
  try {
    const setup = await stripe.setupIntents.create({
      customer: customerId,
    });
    return setup;
  } catch (e) {
    console.log(e.message, e.type);
    if (e.type === "StripeCardError") return e.message;

    return "An unexpected error occured";
  }
};

module.exports.detachPaymentMethod = async (paymentMethodId) => {
  try {
    return await stripe.paymentMethods.detach(paymentMethodId);
  } catch (e) {
    if (e.type === "StripeCardError") return e.message;
    return "An unexpected error occured";
  }
};

module.exports.getPaymentMethods = async (customerId) => {
  try {
    const { data } = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
      limit: 15,
    });
    return data;
  } catch (e) {
    console.log(e.message, e.type);
    return "An unexpected error occured";
  }
};

module.exports.getPaymentMethod = async (paymentMethodId) => {
  try {
    return await stripe.paymentMethods.retrieve(paymentMethodId);
  } catch (e) {
    console.log(e.message, e.type);
    return "An unexpected error occured";
  }
};

module.exports.addMetaData = async (paymentMethodId, _id) => {
  try {
    return await stripe.paymentMethods.update(paymentMethodId, {
      metadata: { _id },
    });
  } catch (e) {
    console.log(e.message, e.type);
    return "An unexpected error occured";
  }
};
