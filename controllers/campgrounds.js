const Campground = require("../models/campgrounds");
const { cloudinary } = require("../cloudinary");
const mapService = require("@mapbox/mapbox-sdk/services/geocoding");
const geoService = mapService({ accessToken: process.env.Campgroud_map_token });

module.exports.displayallCampgrounds = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("pages/campgrounds/index", { campgrounds,  currentPage: req.path, });
};

module.exports.displayNewCampgroundsPage = async (req, res) => {
  res.render("pages/campgrounds/new");
};

module.exports.addNewCampground = async (req, res, next) => {
  try {
    const { item } = req.body;
    const getLocation = await geoService
      .forwardGeocode({
        query: item.location,
        limit: 1,
      })
      .send();
    const filesParams = req.files.map((val) => ({
      url: val.path,
      filename: val.filename,
    }));
    item.author = req.user._id;
    const newItem = new Campground(item);
    newItem.geometry = getLocation.body.features[0].geometry;
    newItem.images = filesParams;
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
    if (!item) return req.flash("error", "Cannot find page");
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
    if (req.files) {
      const files = req.files.map((item) => ({
        url: item.path,
        filename: item.filename,
      }));
      item.images.push(...files);
      await item.save();
    }
    if (req.body.deleteImages) {
      for (let file of req.body.deleteImages) {
        await cloudinary.uploader.destroy(file);
      }
      const updated = await item.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
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
