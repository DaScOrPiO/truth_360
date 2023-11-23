const Campgrounds = require("../../models/campgrounds");
const Reviews = require("../../models/review");

module.exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
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
  const item = await Campgrounds.findById(id);
  if (!item.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect("/campgrounds");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { itemId, reviewId } = req.params;
  const item = await Reviews.findById(reviewId);
  if (!item.author.equals(req.user._id)) {
    req.flash("error", "Sorry You do not have permission to do that");
    return res.redirect(`/campgrounds/${itemId}/show`);
  }
  next();
};
