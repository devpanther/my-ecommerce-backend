const stripe = require("./index");

module.exports.createCustomer = async ({ firstname, lastname, email, _id }) => {
  try {
    const customer = await stripe.customers.create({
      name: `${lastname} ${firstname}`,
      email,
      metadata: {
        _id: _id.toString(),
      },
    });
    return customer;
  } catch (error) {
    return null;
  }
};
