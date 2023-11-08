module.exports.isLoggedIn = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "Please login to perform action!");
    res.redirect("/login");
  }
};
