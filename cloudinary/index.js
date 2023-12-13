const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.key,
  api_secret: process.env.secret,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "truth_360/campgrounds",
    allowedFormats: ["jpg", "jpeg", "png"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
