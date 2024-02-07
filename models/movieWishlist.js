const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/user");

const movieWishlistSchema = {
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Movie_id: {
    type: Number,
    required: true,
  },
  MovieName: {
    type: String,
    required: true,
  },
  Movie_description: {
    type: String,
    required: true,
  },
  Poster_path: {
    type: String,
    required: true,
  },
  Tmdb_rating: {
    type: Number,
    required: true,
  },
  Ratings: {
    type: Schema.Types.ObjectId,
    ref: "MovieReview",
  },
};

module.exports = mongoose.model("MovieWishlist", movieWishlistSchema);
