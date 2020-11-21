const mongoose = require("mongoose");
const random = require("mongoose-simple-random");
const Schema = mongoose.Schema;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    image: {
      type: String,
      required: true,
    },
    nutrients: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    pricePerServing: {
      type: Number,
      required: true,
    },
    cuisines: [
      {
        type: String,
      },
    ],
    dishTypes: [
      {
        type: String,
      },
    ],
    diets: [
      {
        type: String,
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    veryPopular: {
      type: Boolean,
      default: false,
    },
    glutenFree: {
      type: Boolean,
      default: false,
    },
    dairyFree: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.plugin(random);

module.exports = mongoose.model("Recipe", recipeSchema);
