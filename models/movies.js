const mongoose = require("mongoose");
const { Schema } = mongoose;
const user = require("./user");

const movieReviewSchema = new Schema({
  movieName: { type: String },
  rating: {
    type: Number,
  },
  message: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("Movie", movieReviewSchema);
