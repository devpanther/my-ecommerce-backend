const {
  GraphQLNonNull,
  GraphQLID,
  GraphQLError,
  GraphQLString,
} = require("graphql");
const _ = require("lodash");
const Address = require("../models/address");
const Order = require("../models/order");
const User = require("../models/user");
const Payment = require("../models/payment");
const Recipe = require("../models/recipe");
const { createPayment } = require("../stripe/payment");
const { getPaymentMethod } = require("../stripe/card");
const { sendReceiptMail } = require("../utils/mail");

module.exports.takeOrder = {
  type: GraphQLString,
  args: {
    paymentId: { type: new GraphQLNonNull(GraphQLID) },
    addressId: { type: new GraphQLNonNull(GraphQLID) },
  },
  async resolve(parent, { paymentId, addressId }, { req }) {
    if (!(req.user && req.user._id)) return new GraphQLError("Unauthorized");

    let user = await User.findById(req.user._id);
    if (!user) return new GraphQLError("User does not exist");

    const payment = await Payment.findById(paymentId);
    if (!payment) return new GraphQLError("Payment does not exist");

    const address = await Address.findById(addressId);
    if (!payment) return new GraphQLError("Address does not exist");

    const carts = [...user.carts];

    // Calculate Total Price
    const cost = await calculateTotalPrice(carts);

    // Create an order and charge the user
    let order = new Order({
      cost,
      paymentId,
      addressId,
      userId: req.user._id,
      recipes: carts,
    });

    const description = await getDescription(carts);
    const charge = await createPayment({
      amount: cost * 100,
      cardId: payment.cardId,
      customerId: req.user.customerId,
      orderId: order._id.toString(),
      addressId,
      description,
      email: user.email,
    });

    // No Charge was created
    if (typeof charge === "string") return new GraphQLError(charge);

    const card = await getPaymentMethod(charge.payment_method);

    if (typeof card === "string") return new GraphQLError(card);

    order.chargeId = charge.id;

    const card_logo = getCardLogo(card);
    let mailData = {
      amount: cost,
      description,
      email: user.email,
      card_logo,
      last4: card.card ? card.card.last4 : "4242",
      templateId: process.env.RECEIPT_EMAIL_ID,
      date: formatDate(charge.created),
    };
    // Add Order to the recipe
    await addOrderstoRecipe(order._id, carts);

    // Add Order to the user and empty cart
    user.orders = [...user.orders, order.id];
    user.carts = [];
    await order.save();
    await user.save();

    // Send Receipt to the user
    await sendReceiptMail(mailData);

    return "Success";
  },
};

async function getDescription(carts = []) {
  const countObj = _.countBy(carts);
  let recipes = await Recipe.find({ _id: { $in: carts } }).select("_id name");

  recipes = await recipes.map((recipe) => {
    recipe.count = countObj[recipe._id];
    return recipe;
  });

  const lastIndex = recipes.length - 1;
  let description = "Ordered ";

  recipes.forEach((recipe, index) => {
    if (index === lastIndex && index) {
      description += `and ${recipe.name} x${recipe.count}.`;
    } else if (index === lastIndex && index === 0) {
      description += `${recipe.name} x${recipe.count}.`;
    } else {
      description += `${recipe.name} x${recipe.count}, `;
    }
  });

  return description;
}

async function addOrderstoRecipe(orderId, recipeIds = []) {
  const countObj = _.countBy(recipeIds);
  let recipes = await Recipe.find({ _id: { $in: recipeIds } }).select(
    "_id orders"
  );
  recipes.forEach(async (recipe) => {
    recipe.orders = [
      ...recipe.orders,
      ...Array(countObj[recipe._id]).fill(orderId),
    ];
    await recipe.save();
  });
}

function getCardLogo(payment) {
  if (!payment)
    return "https://kenzy-ecommerce.s3.af-south-1.amazonaws.com/mastercard.png";

  if (payment.card.brand.toLowerCase() === "visa")
    return "https://kenzy-ecommerce.s3.af-south-1.amazonaws.com/visa.png";

  return "https://kenzy-ecommerce.s3.af-south-1.amazonaws.com/mastercard.png";
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const dateString = date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return dateString;
}

async function calculateTotalPrice(recipeIds = []) {
  const cartObj = _.countBy(recipeIds);
  let price = 0;
  const recipes = await Recipe.find({ _id: { $in: recipeIds } }).select(
    "_id pricePerServing"
  );

  recipes.forEach((item) => {
    if (cartObj[item._id]) {
      price += item.pricePerServing * cartObj[item._id];
    }
  });

  return ((price * 100) / 100).toFixed(2);
}
