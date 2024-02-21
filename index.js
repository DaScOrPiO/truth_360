if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const userRoutes = require("./views/routes/user_routes");
const locationRoutes = require("./views/routes/location_routes");
const reviewRoutes = require("./views/routes/review_routes");
const movieRoutes = require("./views/routes/movie_route");
const session = require("express-session");
const mongoSanitize = require("express-mongo-sanitize");

const prodConnect = process.env.Prod_db_url
// "mongodb://127.0.0.1:27017/truth_360"
async function main() {
  try {
    await mongoose.connect(prodConnect);
    console.log("Mongoose Connection Success");
  } catch (err) {
    console.log("Seomething Went Wrong", err);
  }
}
main();
mongoose.connection.on("error", (err) => console.log(err));

app.listen(3000, () => {
  console.log("Server Started at port: 3000");
});

const sessionParams = {
  secret: "Thisisasecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 2,
    maxAge: 1000 * 60 * 60 * 24 * 2,
  },
};

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(mongoSanitize());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionParams));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.use("/", campgroundRoutes);
app.use("/", userRoutes);
app.use("/locations", locationRoutes);
app.use("/locations", reviewRoutes);
app.use("/", movieRoutes);

app.get("/", (req, res) => res.render("index", { currentPage: req.path }));

app.use((err, req, res, next) => {
  const { message = "Something went wrong!", code = 500 } = err;
  req.flash("error", `${message}`);
  req.method === "GET"
    ? res.status(code).redirect(req.originalUrl)
    : res.status(code).redirect("/");
  // res.status(code).render("pages/campgrounds/error", { err });
  console.log(message, code);
});
