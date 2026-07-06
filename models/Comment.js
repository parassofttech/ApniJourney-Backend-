const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
  {
    name:{
          type: String,
      required: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trips",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("comment",commentSchema)

module.exports = Comment