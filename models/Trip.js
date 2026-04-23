const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
    budget: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    photos: [String], // Array of image URLs or file paths
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
  },
  { timestamps: true }
);

const TripModel = mongoose.model("trips",tripSchema)
module.exports = TripModel