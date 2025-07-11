const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const shopRoutes = require("./routes/shopRoutes");

// Middleware
app.use(express.json());

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || origin.match(/^http:\/\/(.*\.)?localhost(:\d+)?$/)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // ✅ Allow Postman/cURL

      // ✅ In production: allow all origins (Netlify, subdomains, etc.)
      if (process.env.NODE_ENV === "production") {
        return callback(null, true);
      }

      // ✅ In dev: allow only localhost
      if (origin.match(/^http:\/\/(.*\.)?localhost(:\d+)?$/)) {
        return callback(null, true);
      }

      // ❌ Block everything else
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);





app.use(cookieParser());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});
// UptimeRobot ping route
app.get("/api/ping", (req, res) => {
  console.log('sdfakjsfds')
  res
    .status(200)
    .json({
      status: "ok",
      timestamp: Date.now(),
      message: "Backend is ping!",
    });
});

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api", shopRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/api/test`);
});



 