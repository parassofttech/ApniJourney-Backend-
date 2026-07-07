const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "a6jz0zw6",
  api_key: process.env.CLOUDINARY_API_KEY || "147323419669362",
  api_secret: process.env.CLOUDINARY_API_SECRET  || "Z6FaoZTfZW_QPqVGHw2gzU2qKVc",
});

module.exports = cloudinary;