const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const ErrorMessage = require("../../utils/validation/ErrorMessage");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("Pages/user/register");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.flash("success", "Welcome to Yelpcamp");
    res.redirect("/campgrounds");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
});

router.get("/login", async (req, res) => {
  res.render("Pages/user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", "welcome back");
    res.redirect("/campgrounds");
  }
);

module.exports = router;
