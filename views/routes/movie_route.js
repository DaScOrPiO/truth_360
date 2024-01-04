const express = require("express");
const router = express.Router();
const { showMovies, addMovieReview } = require("../../controllers/movies");

router.get("/", showMovies);
router.post("/", addMovieReview);

module.exports = router