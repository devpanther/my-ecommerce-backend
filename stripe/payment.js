const stripe = require("./index");

module.exports.createPayment = async ({
  amount,
  cardId,
  customerId,
  description,
  orderId,
  addressId,
  email,
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method: cardId,
      customer: customerId,
      description,
      receipt_email: email,
      off_session: true,
      confirm: true,
      metadata: {
        orderId,
        addressId,
      },
    });
    return paymentIntent;
  } catch (e) {
    console.log(e);
    if (e.type === "StripeCardError") return e.message;

    return "An unexpected error occured";
  }
};

module.exports.getPayments = async (customerId) => {
  try {
    const { data } = await stripe.paymentIntents.list({
      limit: 100,
      customer: customerId,
    });
    return data;
  } catch (e) {
    if (e.type === "StripeCardError") return e.message;

    return "An unexpected error occured";
  }
};
