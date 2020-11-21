const mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      // Fix all deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Connected to the db");
  } catch (e) {
    console.error(e);
  }
};
