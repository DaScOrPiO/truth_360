const movieReview = require("../models/movieReview");
const movieWishlist = require("../models/movieWishlist");
const movieWatchlist = require("../models/movieWatchlist");
const axios = require("axios");

const items_per_page = 10;
const key = process.env.movieKey;

// movies section
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

    const currentIndex = 0;
    const reviews = await movieReview.find().populate("Author");
    const usr = res.locals.currentUser || "";

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
        reviews,
        currentIndex,
        usr,
      });
    }
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

    const reviews = await movieReview.find().populate("Author");
    const usr = res.locals.currentUser || "";

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
        reviews,
        usr,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.TvSeries = async (req, res, next) => {
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

    const reviews = await movieReview.find().populate("Author");
    const usr = res.locals.currentUser || "";

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
        reviews,
        usr,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.addToWishlist = async (req, res, next) => {
  try {
    const item = req.body;
    const userId = req.user._id;

    const addNew = new movieWishlist(item);
    addNew.Owner = userId;
    await addNew.save();
    req.flash("success", "Action Successful");
    res.redirect(res.locals.redirect);
  } catch (err) {
    next(err);
  }
};

module.exports.showWishlists = async (req, res, next) => {
  try {
    const items = await movieWishlist.find({ Owner: req.user._id });
    const page = req.query.page || 1;
    const refererUrl = new URL(req.headers.referer);
    const redirectTo = refererUrl.pathname.split("/").pop();

    if (!items || items.length === 0) {
      req.flash("error", "No items to display");
      res.redirect(redirectTo);
    } else {
      const data1 = items.findLast((el) => el);
      const restOfItems = items;
      const startingIndex = (page - 1) * items_per_page;
      const totalItems = items.length;
      const initialData = items.slice(
        startingIndex,
        startingIndex + items_per_page
      );

      const reviews = await movieReview.find().populate("Author");
      const usr = res.locals.currentUser || "";

      res.render("Pages/movies/wishlists", {
        currentPage: req.path,
        item: restOfItems,
        data1,
        totalItems,
        initialData,
        items_per_page,
        reviews,
        usr,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.searchWishlists = async (req, res, next) => {
  try {
    const { movie_name } = req.query;
    const regex = new RegExp(movie_name, "i");

    const inWishlist = await movieWishlist.find({
      MovieName: { $regex: regex },
      Owner: req.user._id,
    });

    return res.json(inWishlist);
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

    req.flash("success", "Action successful");
    res.redirect(res.locals.redirect);
  } catch (err) {
    next(err);
  }
};

module.exports.addReview = async (req, res, next) => {
  try {
    const {
      Movie_id,
      comment,
      rating,
      Movie_poster,
      Movie_name,
      Movie_description,
    } = req.body;
    const userId = req.user._id;

    const review = new movieReview({
      Author: userId,
      Ratings: rating,
      Comment: comment,
      Movie_id: Movie_id,
      Movie_name: Movie_name,
      Movie_description: Movie_description,
      Movie_poster: Movie_poster,
    });
    await review.save();
    req.flash("success", "Action successful");
    res.redirect(res.locals.redirect);
  } catch (err) {
    next(err);
  }
};

module.exports.editReview = async (req, res, next) => {
  try {
    const item = req.body;
    if (item && item.comment !== "") {
      const findReview = await movieReview.findByIdAndUpdate(item.id, {
        Comment: item.comment,
      });

      req.flash("success", "Action successful");
      res.redirect(res.locals.redirect);
    } else {
      req.flash("error", "Failed, comment cannot be empty!");
      res.redirect(res.locals.redirect);
    }
  } catch (err) {
    next(err);
  }
};

module.exports.deleteReview = async (req, res, next) => {
  try {
    const item = req.body;
    const userId = req.user._id;
    const movieID = Number(item.movie_id);
    const reviewToBeDeleted = await movieReview.findOneAndDelete({
      Author: userId,
      _id: item.review_id,
    });

    const movieInWatchlist = await movieWatchlist.findOneAndDelete({
      Movie_id: movieID,
      Owner: userId,
    });
    req.flash("success", "Action successful");
    res.redirect(res.locals.redirect);
  } catch (err) {
    next(err);
  }
};

module.exports.showWatchlists = async (req, res, next) => {
  try {
    const items = await movieWatchlist
      .find({ Owner: req.user._id })
      .populate("Ratings");

    const page = req.query.page || 1;

    const data1 = items.findLast((el) => el);
    const restOfItems = items;
    const startingIndex = (page - 1) * items_per_page;
    const totalItems = items.length;
    const initialData = items.slice(
      startingIndex,
      startingIndex + items_per_page
    );

    const reviews = await movieReview.find().populate("Author");
    const usr = res.locals.currentUser || "";

    res.render("Pages/movies/watchlist", {
      currentPage: req.path,
      data1,
      item: restOfItems,
      totalItems,
      initialData,
      items_per_page,
      reviews,
      usr,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.searchWatchlist = async (req, res, next) => {
  try {
    const { movie_name } = req.query;
    const regex = new RegExp(movie_name, "i");

    const inWatchlist = await movieWatchlist.find({
      Movie_name: { $regex: regex },
      Owner: req.user._id,
    });

    return res.json(inWatchlist);
  } catch (err) {
    next(err);
  }
};
