const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const campgroundSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  location: {
    type: String,
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
  ratings: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndRemove", async function (item) {
  try {
    if (item) {
      await Review.deleteMany({ _id: { $in: item.ratings } });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
