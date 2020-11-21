module.exports.calculateTotalPrice = (data = [], cartObj) => {
  let price = 0;
  data.forEach((item) => {
    price += item.pricePerServing * cartObj[item._id];
  });
  return ((price * 100) / 100).toFixed(2);
};
