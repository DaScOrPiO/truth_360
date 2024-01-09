const movieReview = require("../models/movies");
const movieWishlist = require("../models/movieWishlist");
const axios = require("axios");

const items_per_page = 10;
const key = process.env.movieKey;
module.exports.showMovies = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    // initially load 10 items
    const startingIndex = (page - 1) * items_per_page;
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}`;
    const url2 = `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}`;
    const response = await axios.get(url);
    const response2 = await axios.get(url2);
    const trendingMovies = await response2.data.results;
    const movies = await response.data;
    const data = movies.results;
    const totalItems = trendingMovies.length;
    const data2 = trendingMovies
      .slice(startingIndex, startingIndex + items_per_page)
      .map((el) => el);
    if (data.length <= 0 && data2.length <= 0) {
      req.flash("error", "No items to display");
      res.redirect("/");
    } else {
      res.render("Pages/movies/index", {
        data,
        data2,
        key,
        totalItems,
        trendingMovies,
        items_per_page,
        currentPage: req.path,
      });
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

module.exports.showTvSeries = async (req, res, next) => {
  try {
    const date = new Date();
    const page = req.query.page || 1;
    const startingIndex = (page - 1) * items_per_page;
    const url = `https://api.themoviedb.org/3/discover/tv?api_key=${key}&primary_release_date.gte=${date.getFullYear()}&sort=primary_release_date.asc
    `;
    const url2 = `https://api.themoviedb.org/3/trending/tv/week?api_key=${key}`;
    const response1 = await axios.get(url);
    const response2 = await axios.get(url2);
    const data1 = await response1.data.results;
    const data2 = await response2.data.results;
    const totalItems = data2.length;
    const trendingSeries = data2.slice(
      startingIndex,
      startingIndex + items_per_page
    );
    if (data1.length <= 0 && data2.length <= 0) {
      req.flash("error", "No items to display");
    } else if (!data1 || !data2) {
      req.flash("error", "No data to display");
      res.redirect("/");
    } else {
      res.render("Pages/movies/tvseries", {
        data1,
        data2,
        trendingSeries,
        totalItems,
        items_per_page,
        currentPage: req.path,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.kidsTvSeries = async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const startingIndex = (page - 1) * items_per_page;

    const url1 = `https://api.themoviedb.org/3/movie/now_playing?api_key=${key}`;
    const response1 = await axios.get(url1);
    const data1 = await response1.data.results;

    const url2 = `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}`;
    const response2 = await axios.get(url2);
    const data2 = await response2.data.results;
    const totalItems = data2.length;
    const topRated = data2.slice(startingIndex, startingIndex + items_per_page);
    if (data1.length <= 0 && data2.length <= 0) {
      req.flash("error", "No items to display");
      res.redirect("/");
    } else if (!data1 || !data2) {
      !data1
        ? req.flash("error", "couldn't fetch now playing, try again later :(")
        : !data2
        ? req.flash("error", "couldn't fetch top rated list")
        : next();
    } else {
      res.render("Pages/movies/toprated", {
        data1,
        data2,
        topRated,
        items_per_page,
        startingIndex,
        totalItems,
        currentPage: req.path,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addToWishlist = async (req, res, next) => {
  try {
    const item = req.body;
    console.log(req.user);
    const userId = req.user._id;
    // const addNew = new movieWishlist({
    //   Owner: userId,
    //   Movie_id: item.Movie_id,
    //   MovieName: item.MovieName,
    //   Poster_path: item.Poster_path,
    // });
    // await addNew.save();
    const isPresent = await movieWishlist.findOne({
      Movie_id: item.Movie_id,
      Owner: userId,
    });
    console.log(item, isPresent);
    if (isPresent && isPresent.Movie_id === item.Movie_id) {
      console.log(isPresent.Movie_id === item.Movie_id);
      req.flash("error", "item has been previously added");
      res.redirect("/movies");
    } else {
      const addNew = new movieWishlist(item);
      addNew.Owner = userId;
      await addNew.save();
      req.flash("success", "Action Successful");
      res.redirect("/movies");
    }
  } catch (err) {
    next(err);
  }
};

module.exports.showWishlists = async (req, res, next) => {
  try {
    const items = await movieWishlist.find({ Owner: req.user._id });

    if (!items || items.length === 0) {
      req.flash("error", "No items to display");
      res.redirect("/movies");
    } else {
      const data1 = items.findLast((el) => el);
      const restOfItems = items.slice(1);
      res.render("Pages/movies/wishlists", {
        currentPage: req.path,
        item: restOfItems,
        data1,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.removeFromWishlists = async (req, res, next) => {
  try {
    const queryData = req.body;
    const item = await movieWishlist.findOneAndRemove({
      Movie_id: queryData.Movie_id,
      Owner: req.user._id,
    });
    res.redirect("/movies");
  } catch (err) {
    next(err);
  }
};
