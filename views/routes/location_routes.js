const express = require("express");
const router = express.Router();
const locationController = require("../../controllers/locations");
const { isLoggedIn, isAuthor } = require("../../utils/middleware/middleware");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });
const {
  validateCampgrounds,
} = require("../../utils/validationFunctions/validate");

// Show all campgrounds & Add new campground
router
  .route("/locations")
  .get(locationController.displayallLocation)
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampgrounds,
    locationController.addNewLocation
  );

// Render for for creating new campground
router.get("/locations/new", isLoggedIn, locationController.displayNewLocationPage);

// Show one campground
router.get("/locations/:id/show", locationController.displayOneLocation);

// Search locations
router.get("/locations/search_locations", locationController.searchLocation);

// Edit campground
router.get(
  "/locations/:id/edit",
  isLoggedIn,
  isAuthor,
  locationController.editLocation
);

// Update Campground & delete
router
  .route("/locations/:id")
  .patch(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateCampgrounds,
    locationController.updateLocation
  )
  .delete(isLoggedIn, isAuthor, locationController.deleteLocation);

module.exports = router;
