const Comment = require("../models/Comment");


const addComment = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { text } = req.body;

    const comment = await Comment.create({
      trip: tripId,
      user: req.user.id,
      text,
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
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