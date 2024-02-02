const Location = require("../models/locations");
const { cloudinary } = require("../cloudinary");
const mapService = require("@mapbox/mapbox-sdk/services/geocoding");
const locations = require("../models/locations");
const geoService = mapService({ accessToken: process.env.Campgroud_map_token });

const items_per_page = 10;

module.exports.displayallLocation = async (req, res) => {
  const page = req.query.page || 1;
  const locations = await Location.find({});

  const startingIndex = (page - 1) * items_per_page;
  const totalItems = locations.length;
  const data2 = locations
    .slice(startingIndex, startingIndex + items_per_page)
    .map((el) => el);

  const currentIndex = 0;
  res.render("pages/locations/index", {
    locations,
    currentPage: req.path,
    currentIndex,
    data2,
    items_per_page,
    totalItems,
  });
};

module.exports.displayNewLocationPage = async (req, res) => {
  res.render("pages/locations/new", { currentPage: req.path });
};

module.exports.addNewLocation = async (req, res, next) => {
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
    const newItem = new Location(item);
    newItem.geometry = getLocation.body.features[0].geometry;
    newItem.images = filesParams;
    await newItem.save();
    req.flash("success", "Addition Successful");
    res.redirect("/locations");
  } catch (err) {
    next(err);
  }
};

module.exports.displayOneLocation = async (req, res, next) => {
  try {
    const item = await Location.findById(req.params.id)
      .populate({
        path: "ratings",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!item) return req.flash("error", "Cannot find page");
    res.render("pages/locations/show", { item, currentPage: req.path });
  } catch (err) {
    next(err);
  }
};

module.exports.editLocation = async (req, res, next) => {
  try {
    const item = await Location.findById(req.params.id);
    if (!item) {
      req.flash("error", "Cannot find page");
    } else {
      req.flash("success", "Location edit successful");
      res.render("pages/locations/edit", { item, currentPage: req.path });
    }
  } catch (err) {
    next(err);
  }
};

module.exports.updateLocation = async (req, res, next) => {
  try {
    const item = await Location.findByIdAndUpdate(
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
    req.flash("success", "Location update successful");
    res.redirect("/locations");
  } catch (err) {
    next();
  }
};

module.exports.searchLocation = async (req, res, next) => {
  try {
    const { location_name } = req.query;
    const regex = new RegExp(location_name, "i");

    const locationSearch = await locations.find({
      title: { $regex: regex },
    });

    return res.json(locationSearch);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removedItem = await Location.findByIdAndRemove(id);
    req.flash("success", "Location delete successful");
    res.redirect("/locations");
  } catch (err) {
    next(err);
  }
};
