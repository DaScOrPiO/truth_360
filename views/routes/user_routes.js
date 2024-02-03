const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const ErrorMessage = require("../../utils/validation/ErrorMessage");
const passport = require("passport");
const {
  storeReturnTo,
  redirectUrl,
} = require("../../utils/middleware/middleware");

router.get("/register", (req, res) => {
  res.render("Pages/user/register", { currentPage: req.path });
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to Yelpcamp");
      res.redirect("/");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

router.get("/login", async (req, res) => {
  res.render("Pages/user/login", { currentPage: req.path });
});

router.post(
  "/login",
  storeReturnTo,
  redirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "welcome back");
    const redirect = res.locals.returnTo || "/";
    res.redirect(redirect);
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "logout success! ✔");
    res.redirect("/");
  });
});

module.exports = router;
