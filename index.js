require("dotenv").config();
const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const v1Routes = require("./routes/v1");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1", v1Routes);

app.get("/run", (req, res) => {
  res.send("Server is running ✅");
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `EndPoint not available: ${req.method} ${
      req.originalUrl?.split("?")[0]
    }`,
  });
});

module.exports = app;
module.exports.handler = serverless(app);
