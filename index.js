const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors");
const connectDB = require("./db");
const contactRouter = require("./routes/contactRouter");
const tripRoutes = require("./routes/tripRouter");
const authRouter = require("./routes/authRouter");

const app = express();

app.use(cors());
app.use(express.json());
await connectDB()

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use("/api/trips", tripRoutes);
app.use("/api/contact", contactRouter);

app.get("/api/trips", (req, res) => {
  res.json({ message: "Trips fetched" });
});



module.exports= app