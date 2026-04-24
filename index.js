const express = require("express")
require("dotenv").config()
const cors = require("cors");
const connectDB = require("./db");
const contactRouter = require("./routes/contactRouter");
const tripRoutes = require("./routes/tripRouter");
const authRouter = require("./routes/authRouter");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
connectDB();

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});
app.use("/api/auth",authRouter)
app.use("/api/trips", tripRoutes);
app.use("/api/contact", contactRouter);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

module.exports= app