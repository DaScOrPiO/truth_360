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

module.exports = router;
