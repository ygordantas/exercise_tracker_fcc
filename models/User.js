const mongoose = require("mongoose");
const shortid = require("shortid");
const exerciseSchema = require("./Exercise");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true },
  _id: {
    type: String,
    default: shortid.generate
  },
  count: { type: Number, default: 0 },
  log: [exerciseSchema]
});
module.exports = mongoose.model("User", userSchema);
