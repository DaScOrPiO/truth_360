const express = require("express");
const router = express.Router();
const {
  showMovies,
  addMovieReview,
  showTvSeries,
} = require("../../controllers/movies");

router.get("/movies", showMovies).get("/tvseries", showTvSeries);
router.post("/", addMovieReview);

module.exports = router;
