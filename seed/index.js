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

const arrayLoop = (someArr) =>
  someArr[Math.floor(Math.random() * someArr.length)];

const creatItems = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const randPrice = Math.floor(Math.random() * 100 + 1);
    const campSite = new Campground({
      author: "6578acc8a9bcb95f4fee9da3",
      location: `${(cities[rand].city, cities[rand].state)}`,
      title: `${arrayLoop(descriptors)} ${arrayLoop(places)}`,
      price: randPrice,
      geometry: { type: "Point", coordinates: [-87.624421, 41.875562] },
      images: [
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "image1",
        },
        {
          url: "https://source.unsplash.com/collection/483251",
          filename: "image2",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id quam faucibus, volutpat diam vel, hendrerit quam.",
    });
    await campSite.save();
  }
};

creatItems().then(() => mongoose.connection.close());
