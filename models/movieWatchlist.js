const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieWatchlistSchema = new Schema({
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  Movie_id: {
    type: String,
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

  Ratings: {
    type: Schema.Types.ObjectId,
    ref: "MovieReview",
  },
});

module.exports = mongoose.model("MovieWatchlist", movieWatchlistSchema);
