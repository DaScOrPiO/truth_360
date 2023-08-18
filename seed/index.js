const Campground = require("../models/campgrounds");
const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/truth_360");
    console.log("Conection Success");
  } catch (err) {
    console.log("Something Went wrong", err);
  }
}
main();
mongoose.connection.on("error", (err) => console.log("Error:", err));

const arrayLoop = (someArr) => someArr[Math.floor(Math.random() * someArr.length)];

const creatItems = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const campSite = new Campground({
      location: `${(cities[rand].city, cities[rand].state)}`,
      title: `${arrayLoop(descriptors)} ${arrayLoop(places)}`,
    });
    await campSite.save();
  }
};

creatItems().then(() => mongoose.connection.close());
