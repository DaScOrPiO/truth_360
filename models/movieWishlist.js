const mongoose = require("mongoose");
const { Schema } = mongoose;
const User = require("../models/user");

const movieWishlistSchema = {
  Owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Movie_id: {
    type: String,
  },
  MovieName: {
    type: String,
  },
  poster_path: {
    type: String,
  },
};

module.exports = mongoose.model("MovieWishlist", movieWishlistSchema);
