const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { cloudinary } = require("../cloudinary");

const imageSchema = new Schema({
  url: String,
  filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

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
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  images: [imageSchema],
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
      await cloudinary.uploader.destroy(item.images.filename);
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
