const TripModel = require("../models/Trip")

const createTrip = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "User not authorized"
      });
    }

    const {
      title,
      destination,
      category,
      startDate,
      endDate,
      description,
      notes,
      budget,
      rating,
      photos
    } = req.body;

    const trip = new TripModel({
      title,
      destination,
      category,
      startDate,
      endDate,
      description,
      notes,
      budget,
      rating,
      photos,
      userId: req.user._id, // ✅ FIXED
    });

    await trip.save();

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      trip
    });

  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create trip"
    });
  }
};


//  const createTrip = async (req, res) => {
//   try {
//     const trip = new TripModel(req.body);
//     await trip.save();
//     res.status(201).json({ success: true, message: "Trip created successfully", trip });
//   } catch (error) {
//     console.error("Error creating trip:", error);
//     res.status(500).json({ success: false, message: "Failed to create trip" });
//   }
// };






//  Get all trips
const getTrips = async (req, res) => {
  try {
    const trips = await TripModel.find({
      userId: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips"
    });
  }
};


//  Get a single trip by ID
const getTripById = async (req, res) => {
   try {
    const trip = await TripModel.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });
    res.json({ trip });
  } catch (err) {
    res.status(500).json({ message: "Error fetching trip", error: err.message });
  }
};

//  Update trip details
const updateTrip = async (req, res) => {
  try {
    const updatedTrip = await TripModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) return res.status(404).json({ success: false, message: "Trip not found" });
    res.status(200).json({ success: true, message: "Trip updated successfully", updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ success: false, message: "Failed to update trip" });
  }
};

//  Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await TripModel.findByIdAndDelete(req.params.id);
    if (!deletedTrip) return res.status(404).json({ success: false, message: "Trip not found" });
    res.status(200).json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ success: false, message: "Failed to delete trip" });
  }
};

//  Add new expense to a trip
const addExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    const trip = await TripModel.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    trip.expenses.push({ title, amount, category });
    await trip.save();

    res.status(200).json({ success: true, message: "Expense added", trip });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ success: false, message: "Failed to add expense" });
  }
};


          

//  Add document (ID proof, ticket, etc.)
const addDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, type } = req.body;

    const trip = await TripModel.findById(id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    trip.documents.push({ name, url, type });
    await trip.save();

    res.status(200).json({ success: true, message: "Document added successfully", trip });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ success: false, message: "Failed to add document" });
  }
 };



 const viewTrips = async (req, res) => {
  try {
    const trips = await TripModel.find()

    res.status(200).json({
      success: true,
      trips
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch trips"
    });
  }
};


module.exports = {createTrip, getTrips ,getTripById, updateTrip,deleteTrip,addExpense,addDocument,viewTrips}