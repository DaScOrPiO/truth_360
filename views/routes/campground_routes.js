const express = require("express");
const router = express.Router();
const Campground = require("../../models/campgrounds");
const Review = require("../../models/review");
const campgroundController = require("../../controllers/campgrounds");
const { isLoggedIn, isAuthor } = require("../../utils/middleware/middleware");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const {
  validateCampgrounds,
} = require("../../utils/validationFunctions/validate");

// Show all campgrounds & Add new campground
router
  .route("/")
  .get(campgroundController.displayallCampgrounds)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampgrounds,
    campgroundController.addNewCampground
  );

// Render for for creating new campground
router.get("/new", isLoggedIn, campgroundController.displayNewCampgroundsPage);

// Show one campground
router.get("/:id/show", campgroundController.displayOneCampground);

// Edit campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  campgroundController.editCampground
);

// Update Campground & delete
router
  .route("/:id")
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampgrounds,
    campgroundController.updateCampground
  )
  .delete(isLoggedIn, isAuthor, campgroundController.deleteCampground);

module.exports = router;
