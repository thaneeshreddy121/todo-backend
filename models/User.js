const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  // for forgot password feature
  securityQuestion: String,
  securityAnswer: String,
});

module.exports = mongoose.model("User", userSchema);