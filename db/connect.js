const mongoose = require("mongoose");

// mongoose v6 - no need for deprecation warnings options object
const connectDB = (url) => {
  return mongoose.connect(url);
};

module.exports = connectDB;
