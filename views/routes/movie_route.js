const express = require("express");
const router = express.Router();
const {
  showMovies,
  addMovieReview,
  showTvSeries,
  kidsTvSeries,
} = require("../../controllers/movies");

router
  .get("/movies", showMovies)
  .get("/tvseries", showTvSeries)
  .get("/toprated", kidsTvSeries);
router.post("/", addMovieReview);

module.exports = router;
