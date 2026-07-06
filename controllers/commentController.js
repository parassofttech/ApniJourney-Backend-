const Comment = require("../models/Comment");


const addComment = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { text,name } = req.body;
    const 
    
    // Check karein ki user exist karta hai
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const comment = await Comment.create({
      trip: tripId,
      user: req.user._id, // .id ki jagah ._id try karein
      text,
      name,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const { tripId } = req.params;

    const comments = await Comment.find({
      trip: tripId,
    })
      .populate("user", "name profilePic")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);

    res.json({
      message: "Comment deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {addComment,
    getComments,
    deleteComment
}