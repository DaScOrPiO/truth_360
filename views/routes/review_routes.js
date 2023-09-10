const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../../models/campgrounds");
const Review = require("../../models/review");
const { validateReviews } = require("../../utils/validationFunctions/validate");

// Add reviews
router.post("/:id/reviews", validateReviews, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { item } = req.body;
    const campground = await Campground.findById(id);
    const newReview = new Review(item);
    campground.ratings.push(newReview);
    await newReview.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}/show`);
  } catch (err) {
    next(err);
  }
});

// Delete Reviews
router.delete("/:itemId/:reviewId/review", async (req, res, next) => {
  try {
    const { itemId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(itemId, {
      $pull: { ratings: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${itemId}/show`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
