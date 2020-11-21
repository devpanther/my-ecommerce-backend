const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      match: /^[a-z ,.'-]+$/i,
      required: true,
      uppercase: true,
    },
    lastname: {
      type: String,
      match: /^[a-z ,.'-]+$/i,
      required: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 250,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
    tokenCount: {
      type: Number,
      default: 1,
    },
    customerId: {
      type: String,
      required: true,
    },
    carts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  const token = await jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      isAdmin: this.isAdmin,
      isActivated: this.isActivated,
    },
    process.env.SECRET_KEY
  );
  return token;
};

userSchema.methods.generateEmailToken = async function () {
  const token = await jwt.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_KEY,
    { expiresIn: "3h" }
  );
  return token;
};

module.exports = mongoose.model("User", userSchema);
