const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    cost: {
      type: Number,
      required: true,
    },
    recipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
        required: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    chargeId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
