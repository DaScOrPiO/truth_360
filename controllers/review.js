const Location = require("../models/locations");
const Review = require("../models/review");

module.exports.addNewReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    item.author = req.user._id;
    const location = await Location.findById(id);
    const newReview = new Review(item);
    location.ratings.push(newReview);
    await newReview.save();
    await location.save();
    req.flash("success", "New review added");
    res.redirect(`/locations/${id}/show`);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const { itemId, reviewId } = req.params;
    await Location.findByIdAndUpdate(itemId, {
      $pull: { ratings: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/locations/${itemId}/show`);
  } catch (err) {
    next(err);
  }
};
