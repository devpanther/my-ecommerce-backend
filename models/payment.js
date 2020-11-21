const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    cardId: { type: String, required: true }, // Payment method id from stripe
    customerId: { type: String, required: true }, // Customer's id from stripe
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
