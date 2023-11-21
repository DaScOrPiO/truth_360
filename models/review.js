const mongoose = require("mongoose");
const { Schema } = mongoose;
const Campground = require("./campgrounds");

const reviewSchema = new Schema({
  rating: Number,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Review", reviewSchema);
