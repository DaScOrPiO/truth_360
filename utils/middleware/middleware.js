const Locations = require("../../models/locations");
const Reviews = require("../../models/review");
const movieReview = require("../../models/movieReview");
const movieWatchlist = require("../../models/movieWatchlist");
const movieWishlist = require("../../models/movieWishlist");

module.exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    const refererUrl = new URL(req.headers.referer);
    const redirectTo = refererUrl.pathname.split("/").pop();
    req.method === "GET"
      ? (req.session.returnTo = req.originalUrl)
      : (req.session.returnTo = redirectTo);
    req.flash("error", "Please login to perform action!");
    res.redirect("/login");
  }
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    const path = (res.locals.returnTo = req.session.returnTo);
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const item = await Locations.findById(id);
  if (!item.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect("/locations");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { itemId, reviewId } = req.params;
  const item = await Reviews.findById(reviewId);
  if (!item.author.equals(req.user._id)) {
    req.flash("error", "Sorry You do not have permission to do that");
    return res.redirect(`/locations/${itemId}/show`);
  }
  next();
};

module.exports.redirectUrl = async (req, res, next) => {
  const refererUrl = new URL(req.headers.referer);
  const redirectTo = refererUrl.pathname.split("/").pop();
  res.locals.redirect = redirectTo;
  next();
};

module.exports.itemIsReviewed = async (req, res, next) => {
  const { Movie_id } = req.body;
  const refererUrl = new URL(req.headers.referer);
  const redirectTo = refererUrl.pathname.split("/").pop();
  const hasReview = await movieReview.findOne({
    Author: req.user._id,
    Movie_id: Movie_id,
  });
  if (hasReview) {
    req.flash(
      "error",
      "You have previously reviewed this movie, edit review instead!"
    );
    res.redirect(res.locals.redirect);
  } else {
    next();
  }
};

module.exports.presentInWishlistsOrWatchlists = async (req, res, next) => {
  const item = req.body;
  const userId = req.user._id;

  const inWatchlist = await movieWatchlist.findOne({
    Movie_id: item.Movie_id,
    Owner: userId,
  });

  const isPresent = await movieWishlist.findOne({
    Movie_id: item.Movie_id,
    Owner: userId,
  });
  if (inWatchlist) {
    req.flash("error", "Item among movies you've seen");
    res.redirect(res.locals.redirect);
  } else if (isPresent && isPresent.Movie_id === Number(item.Movie_id)) {
    req.flash("error", "item has been previously added");
    res.redirect(res.locals.redirect);
  } else {
    next();
  }
};

module.exports.presentinWatchlist = async (req, res, next) => {
  const refererUrl = new URL(req.headers.referer);
  const redirectTo = refererUrl.pathname.split("/").pop();

  const items = await movieWatchlist
    .find({ Owner: req.user._id })
    .populate("Ratings");

  if (!items || items.length === 0) {
    req.flash("error", "No items to display");
    res.redirect(redirectTo);
  } else {
    next();
  }
};
