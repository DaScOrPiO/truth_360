const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("./user");

const MovieReviewSchema = new Schema({
  Author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Ratings: {
    type: Number,
    required: true,
    min: [1, "Ratings should be at least 1"],
    max: [5, "Ratings should have a max of 5"],
  },
  Comment: {
    type: String,
    required: true,
  },
  Movie_id: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("MovieReview", MovieReviewSchema);
