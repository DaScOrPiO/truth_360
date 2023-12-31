const Campground = require("../models/campgrounds");
const Review = require("../models/review");

module.exports.addNewReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    item.author = req.user._id;
    const campground = await Campground.findById(id);
    const newReview = new Review(item);
    campground.ratings.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash("success", "New review added");
    res.redirect(`/campgrounds/${id}/show`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { itemId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(itemId, {
      $pull: { ratings: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/campgrounds/${itemId}/show`);
  } catch (err) {
    next(err);
  }
};
