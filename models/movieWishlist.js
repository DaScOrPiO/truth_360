const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieWishlistSchema = {
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
