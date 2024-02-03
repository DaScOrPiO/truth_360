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
  editReview,
  deleteReview,
  searchWishlists,
  searchWatchlist,
} = require("../../controllers/movies");
const {
  isLoggedIn,
  itemIsReviewed,
  presentInWishlistsOrWatchlists,
  presentinWatchlist,
  redirectUrl
} = require("../../utils/middleware/middleware");

router
  .get("/movies", showMovies)
  .get("/tvseries", showTvSeries)
  .get("/toprated", TvSeries)
  .get("/wishlists", isLoggedIn, showWishlists)
  .get("/watchlists", isLoggedIn, presentinWatchlist, showWatchlists)
  .get("/search_wishlist", isLoggedIn, searchWishlists)
  .get("/search_watchlist", isLoggedIn, searchWatchlist);

router
  .post(
    "/addtowishlist",
    isLoggedIn,
    redirectUrl,
    upload.none(),
    presentInWishlistsOrWatchlists,
    addToWishlist
  )
  .post("/remove_fromwishlist", isLoggedIn, redirectUrl, upload.none(), removeFromWishlists)
  .post("/add_review", isLoggedIn, redirectUrl, upload.none(), itemIsReviewed, addReview)
  .put("/edit_review", isLoggedIn, redirectUrl, upload.none(), editReview)
  .delete("/delete_review", redirectUrl, isLoggedIn, deleteReview);

module.exports = router;
