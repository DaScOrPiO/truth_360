const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = require("./user");

const movieSchema = new Schema({
  rating: {
    type: Schema.Types.ObjectId,
    ref: "MovieReview",
  },
  wishlists: {
    type: Schema.Types.ObjectId,
    ref: "MovieWishlist",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Movie", movieSchema);
