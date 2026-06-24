const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  securityQuestion: String,
  securityAnswer: String,

  address: {
    type: String,
    default: "Not Added",
  },
});

module.exports = mongoose.model("User", userSchema);