const express = require("express");
const router = express.Router();
const Campground = require("../../models/campgrounds");
const Review = require("../../models/review");
const {
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
    req.flash("success", "Addition Successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

// Show one campground
router.get("/:id/show", async (req, res, next) => {
  try {
    const item = await Campground.findById(req.params.id).populate("ratings");
    if (!item) req.flash("error", "Cannot find page");
    res.render("pages/campgrounds/show", { item });
  } catch (err) {
    next(err);
  }
});

// Edit campground
router.get("/:id/edit", async (req, res, next) => {
  try {
    const item = await Campground.findById(req.params.id);
    if (!item) {
      req.flash("error", "Cannot find page");
    } else {
      req.flash("success", "Campground edit successful");
      res.render("pages/campgrounds/edit", { item });
    }
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
    req.flash("success", "Campground update successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next();
  }
});

// Delete Campground
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedItem = await Campground.findByIdAndRemove(id);
    req.flash("success", "Campground delete successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
