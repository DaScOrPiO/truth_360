const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const campgroundSchema = new Schema({
  title: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Campground", campgroundSchema);
