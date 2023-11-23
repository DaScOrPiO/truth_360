const Campground = require("../models/campgrounds");

module.exports.displayallCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("pages/campgrounds/index", { campgrounds });
};

module.exports.displayNewCampgroundsPage = async (req, res) => {
  res.render("pages/campgrounds/new");
};

module.exports.addNewCampground = async (req, res, next) => {
  try {
    const { item } = req.body;
    item.author = req.user._id;
    const newItem = new Campground(item);
    await newItem.save();
    req.flash("success", "Addition Successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
};

module.exports.displayOneCampground = async (req, res, next) => {
  try {
    const item = await Campground.findById(req.params.id)
      .populate({
        path: "ratings",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!item) req.flash("error", "Cannot find page");
    res.render("pages/campgrounds/show", { item });
  } catch (err) {
    next(err);
  }
};

module.exports.editCampground = async (req, res, next) => {
  try {
    const item = await Campground.findById(req.params.id);
    if (!item) {
      req.flash("error", "Cannot find page");
    } else {
      req.flash("success", "Campground edit successful");
      res.render("pages/campgrounds/edit", { item });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateCampground = async (req, res, next) => {
  try {
    const item = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.item
    );
    req.flash("success", "Campground update successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next();
  }
};

module.exports.deleteCampground = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedItem = await Campground.findByIdAndRemove(id);
    req.flash("success", "Campground delete successful");
    res.redirect("/campgrounds");
  } catch (err) {
    next(err);
  }
};
