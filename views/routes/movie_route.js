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
} = require("../../controllers/movies");
const { isLoggedIn } = require("../../utils/middleware/middleware");

router
  .get("/movies", showMovies)
  .get("/tvseries", showTvSeries)
  .get("/toprated", kidsTvSeries)
  .get("/wishlists", showWishlists);

router
  .post("/", addMovieReview)
  .post("/addtowishlist", isLoggedIn, upload.none(), addToWishlist);

module.exports = router;
