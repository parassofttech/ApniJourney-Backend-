const express = require("express")
const { getComments, addComment, deleteComment } = require("../controllers/commentController");

const auth = require("../middleware/auth");

const commentRouter = express.Router()

commentRouter.get("/:tripId",getComments)

commentRouter.post("/:tripId", auth, addComment);

commentRouter.delete("/:id", auth, deleteComment);


module.exports = commentRouter