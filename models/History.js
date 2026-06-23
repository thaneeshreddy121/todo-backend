const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  name: String,
  dueDate: String,
  deletedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("History", historySchema);