const mongoose = require("mongoose");
const { Schema } = mongoose;

const exerciseSchema = new Schema({
  description: { type: String, required },
  duration: { type: String, required },
  userId: { type: Schema.Types.ObjectId, ref: "User", required },
  date: Date
});

mongoose.model("Exercise", exerciseSchema);
