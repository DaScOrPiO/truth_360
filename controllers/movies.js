const movieReview = require("../models/movies");
const axios = require("axios");

const items_per_page = 10;
module.exports.showMovies = async (req, res, next) => {
  try {
    const key = process.env.movieKey;
    const page = req.query.page || 1;
    // initially load 10 items
    const startingIndex = (page - 1) * items_per_page;
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}`;
    const url2 = `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`;
    const response = await axios.get(url);
    const response2 = await axios.get(url2);
    const moviesByCurrentMonth = await response2.data;
    const movies = await response.data;
    const data = movies.results;
    const data2 = moviesByCurrentMonth.results
      .slice(startingIndex, startingIndex + items_per_page)
      .map((el) => el);
    if (data.length <= 0 && data2.length <= 0) {
      req.flash("error", "No items to display");
    } else {
      console.log(data2);
      res.render("Pages/movies/index", { data, data2, key });
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
