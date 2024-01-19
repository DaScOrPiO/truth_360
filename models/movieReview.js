const mongoose = require("mongoose");
const { Schema } = mongoose;
const movieWatchlist = require("./movieWatchlist");
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
  Movie_name: {
    type: String,
    required: true,
  },
  Movie_description: {
    type: String,
    required: true,
  },
  Movie_poster: {
    type: String,
    required: true,
  },
});

MovieReviewSchema.post("save", async function () {
  try {
    const new_watchList = new movieWatchlist({
      Owner: this.Author,
      Movie_id: this.Movie_id,
      Movie_name: this.Movie_name,
      Movie_description: this.Movie_description,
      Ratings: this,
    });
    await new_watchList.save();
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("MovieReview", MovieReviewSchema);
