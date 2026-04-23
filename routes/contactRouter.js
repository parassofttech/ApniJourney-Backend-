const express = require("express")
const { contactIns, viewMsg, deleteMsg } = require("../controllers/contactController")

const contactRouter = express.Router()

contactRouter.post("/send",contactIns)

contactRouter.get("/",viewMsg)

contactRouter.delete("/:id", deleteMsg)

module.exports = contactRouter