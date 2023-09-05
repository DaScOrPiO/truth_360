const express = require("express");
const router = express.Router();
const Campground = require("../../models/campgrounds");
const Review = require("../../models/review");
const {
  validateReviews,
  validateCampgrounds,
} = require("../../utils/validationFunctions/validate");

// Show all campgrounds
router.get("/", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("pages/campgrounds/index", { campgrounds });
});

// Render for for creating new campground
router.get("/new", async (req, res) => {
  res.render("pages/campgrounds/new");
});

// Add new campground
router.post("/", validateCampgrounds, async (req, res, next) => {
  try {
    const { item } = req.body;
    const newItem = new Campground(item);
    await newItem.save();
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

// Show one campground
router.get("/:id/show", async (req, res) => {
  const item = await Campground.findById(req.params.id).populate("ratings");
  res.render("pages/campgrounds/show", { item });
});

// Edit campground
router.get("/:id/edit", async (req, res) => {
  const item = await Campground.findById(req.params.id);
  res.render("pages/campgrounds/edit", { item });
});

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

// Update Campground
router.patch("/:id/", validateCampgrounds, async (req, res, next) => {
  try {
    const item = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.item
    );
    console.log(req.body);
    res.redirect("/campgrounds");
  } catch (err) {
    next();
  }
});

// Delete Campground
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const removedItem = await Campground.findByIdAndRemove(id);
  res.redirect("/campgrounds");
});

// Delete Reviews
router.delete("/:itemId/:reviewId/review", async (req, res) => {
  const { itemId, reviewId } = req.params;
  await Campground.findByIdAndUpdate(itemId, { $pull: { ratings: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${itemId}/show`);
});

module.exports = router;
