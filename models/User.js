const mongoose = require("mongoose");
const shortid = require("shortid");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required },
  _id: {
    type: String,
    default: shortid.generate
  }
});

mongoose.model("User", userSchema);
