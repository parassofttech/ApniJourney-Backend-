const express = require("express");
const { createTrip, getTrips, getTripById, updateTrip, deleteTrip, viewTrips } = require("../controllers/tripController");
const verifyTokens = require("../middleware/verifyToken");
const verifyToken = require("../middleware/verifyToken");
// const createMiddleware = require("../middleware/createMiddleware");
// const authMiddleware = require("../middleware/createMiddleware");


const tripRoutes = express.Router();

//  Create new trip
tripRoutes.post("/",verifyToken, createTrip);

//  Get all trips
// router.get("/", getAllTrips);

tripRoutes.get('/',verifyToken, getTrips);

tripRoutes.get('/detail', viewTrips);

//  Get trip by ID
tripRoutes.get("/:id", getTripById);

//  Update trip
tripRoutes.put("/:id", updateTrip);

//  Delete trip
tripRoutes.delete("/:id", deleteTrip);
module.exports = tripRoutes