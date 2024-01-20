const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const {
  showMovies,
  addMovieReview,
  showTvSeries,
  TvSeries,
  addToWishlist,
  showWishlists,
  removeFromWishlists,
  addReview,
  showWatchlists,
} = require("../../controllers/movies");
const {
  isLoggedIn,
  itemIsReviewed,
  presentInWishlistsOrWatchlists,
} = require("../../utils/middleware/middleware");

router
  .get("/movies", showMovies)
  .get("/tvseries", showTvSeries)
  .get("/toprated", TvSeries)
  .get("/wishlists", isLoggedIn, showWishlists)
  .get("/watchlists", isLoggedIn, showWatchlists);

router
  .post("/", addMovieReview)
  .post(
    "/addtowishlist",
    isLoggedIn,
    upload.none(),
    presentInWishlistsOrWatchlists,
    addToWishlist
  )
  .post("/remove_fromwishlist", isLoggedIn, upload.none(), removeFromWishlists)
  .post("/add_review", isLoggedIn, upload.none(), itemIsReviewed, addReview);

module.exports = router;
