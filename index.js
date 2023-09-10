const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundRoutes = require("./views/routes/campground_routes");
const reviewRoutes = require("./views/routes/review_routes");
const session = require("express-session");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/truth_360");
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
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionParams));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds", reviewRoutes);

app.get("/", (req, res) => res.render("index"));

app.use((err, req, res, next) => {
  const { message = "Something went wrong!", code = 500 } = err;
  res.status(code).render("pages/campgrounds/error", { err });
  console.log(message, code);
});
