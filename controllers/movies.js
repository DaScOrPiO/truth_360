const movieReview = require("../models/movies");
const axios = require("axios");

module.exports.showMovies = async (req, res, next) => {
  try {
    const key = process.env.movieKey;
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}`;
    const response = await axios.get(url);
    const movies = await response.data
    const data = movies.results
    if (data.length <= 0) {
      req.flash("error", "No items to display");
    } else {
      console.log(data)
      res.render("Pages/movies/index", { data });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addMovieReview = async (req, res, next) => {
  try {
    console.log("hello World");
    res.send("hello world");
  } catch (err) {
    next(err);
  }
};
