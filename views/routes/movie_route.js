const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  showMovies,
  addMovieReview,
  showTvSeries,
  kidsTvSeries,
  addToWishlist,
  showWishlists,
  removeFromWishlists,
  addReview,
} = require("../../controllers/movies");
const { isLoggedIn } = require("../../utils/middleware/middleware");

router
  .get("/movies", showMovies)
  .get("/tvseries", showTvSeries)
  .get("/toprated", kidsTvSeries)
  .get("/wishlists", isLoggedIn, showWishlists);

router
  .post("/", addMovieReview)
  .post("/addtowishlist", isLoggedIn, upload.none(), addToWishlist)
  .post("/remove_fromwishlist", isLoggedIn, upload.none(), removeFromWishlists)
  .post("/add_review", isLoggedIn, upload.none(), addReview);

module.exports = router;
