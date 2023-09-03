const mongoose = require("mongoose");
const { Schema } = mongoose;
const Campground = require("./campgrounds");

const reviewSchema = new Schema({
  rating: Number,
  description: String,
});

module.exports = mongoose.model("Review", reviewSchema);
