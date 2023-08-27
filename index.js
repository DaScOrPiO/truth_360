const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

const Campground = require("./models/campgrounds");
const methodOverride = require("method-override");
const campgrounds = require("./models/campgrounds");
const ejsMate = require("ejs-mate");

const ErrorMessage = require("./utils/validation/ErrorMessage");
const { campgroundSchema } = require("./utils/validation/SchemaValidator");

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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => [res.render("index")]);

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("pages/campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req, res) => {
  res.render("pages/campgrounds/new");
});

const validateSchema = (req, res, next) => {
  const { item } = req.body;
  const result = campgroundSchema.validate(item);
  const { error } = result;
  if (error) {
    const message = error.details.map((el) => el.message);
    throw new ErrorMessage(message, 400);
  } else {
    next();
  }
};

app.post("/campgrounds", validateSchema, async (req, res, next) => {
  try {
    const newItem = new Campground(item);
    await newItem.save();
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
});

app.get("/campgrounds/:id/show", async (req, res) => {
  const item = await Campground.findById(req.params.id);
  res.render("pages/campgrounds/show", { item });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const item = await Campground.findById(req.params.id);
  res.render("pages/campgrounds/edit", { item });
});

app.patch("/campgrounds/:id/", validateSchema, async (req, res, next) => {
  try {
    const item = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.item
    );
    console.log(req.body);
    res.redirect("/campgrounds");
  } catch (err) {
    next();
  }
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const removedItem = await Campground.findByIdAndRemove(id);
  res.redirect("/campgrounds");
});

app.use((err, req, res, next) => {
  const { message = "Something went wrong!", code = 500 } = err;
  res.status(code).render("pages/campgrounds/error", { err });
  console.log(message, code);
});
