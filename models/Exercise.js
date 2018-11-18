const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});

module.exports = exerciseSchema;
