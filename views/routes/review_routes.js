const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../../models/campgrounds");
const Review = require("../../models/review");
const reviewController = require("../../controllers/review");
const { validateReviews } = require("../../utils/validationFunctions/validate");
const {
  isReviewAuthor,
  isLoggedIn,
} = require("../../utils/middleware/middleware");

// Add reviews
router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReviews,
  reviewController.addNewReview
);

// Delete Reviews
router.delete(
  "/:itemId/:reviewId/review",
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
