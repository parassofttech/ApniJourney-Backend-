const express = require("express");
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip, viewTrips, likeTrip } = require("../controllers/tripController");
const verifyTokens = require("../middleware/verifyToken");
const verifyToken = require("../middleware/verifyToken");
const upload = require("../middleware/upload.");



const tripRoutes = express.Router();

//  Create new trip
tripRoutes.post( "/",
  verifyToken,
  upload.array("photos", 10),
  createTrip);

  tripRoutes.post("/:id/like", verifyToken, likeTrip);

//  Get all trips


tripRoutes.get('/',verifyToken, getTrips);

tripRoutes.get('/detail', viewTrips);

//  Get trip by ID
tripRoutes.get("/:id", getTripById);

//  Update trip
tripRoutes.put("/:id", updateTrip);

//  Delete trip
tripRoutes.delete("/:id", deleteTrip);
module.exports = tripRoutes