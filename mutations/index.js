const { GraphQLObjectType } = require("graphql");
const {
  register,
  verifyEmail,
  sendResetToken,
  resetPassword,
  activateEmail,
  login,
  logout,
} = require("./user");
const { addPayment, deletePayment, getSecret } = require("./payment");
const { toggleLike, toggleCart, deleteCart } = require("./recipe");
const { takeOrder } = require("./order");
const { addComment, updateComment, deleteComment } = require("./comment");
const { addAddress, updateAddress, deleteAddress } = require("./address");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    register,
    verifyEmail,
    sendResetToken,
    resetPassword,
    activateEmail,
    login,
    logout,
    addAddress,
    updateAddress,
    deleteAddress,
    getSecret,
    addPayment,
    deletePayment,
    deleteCart,
    toggleLike,
    toggleCart,
    takeOrder,
    addComment,
    updateComment,
    deleteComment,
  },
});

module.exports = Mutation;
