const express = require("express");
const connectDB = require("./db/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//test route
app.get("/", (req, res) => {
  res.json({
    message: "all good",
    status: "200",
  });
});

//ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/activities", require("./routes/activityRoute"));
app.use("/api/bookings", require("./routes/bookingRoute"));

//connecting to database and if everything goes well, the app will listen on port 8000
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error);
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log("Server is running");
    });
  })
  .catch((error) => {
    console.log("connection failed", error);
  });
