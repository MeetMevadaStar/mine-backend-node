require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const v1Routes = require("./routes/v1");

// Middlewares
app.use(cors());
app.use(express.json());

// Route grouping
app.use("/api/v1", v1Routes);

// //* Server
app.use((req, res, next) => {
  req.APINotFound = true;
  return res.status(404).json({
    error: "Not Found",
    message: `EndPoint not available: ${req.method} ${
      req.originalUrl?.split("?")[0]
    }`,
  });
});

app.get("/api", (req, res) => {
  res.send("Server is running ✅");
});
