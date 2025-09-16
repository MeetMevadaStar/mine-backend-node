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

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    error: "Not Found",
    message: `EndPoint not available: ${req.method} ${
      req.originalUrl?.split("?")[0]
    }`,
  });
});

// ❌ REMOVE app.listen
// ✅ Instead export as module for Vercel
module.exports = app;

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");

// const app = express();
// const v1Routes = require("./routes/v1");

// const PORT = process.env.PORT || 5000;
// const HOST = process.env.HOST || "localhost";

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Route grouping
// app.use("/api/v1", v1Routes); // ✅ This is enough

// // //* Server
// app.use((req, res, next) => {
//   req.APINotFound = true;
//   return res.status(404).json({
//     error: "Not Found",
//     message: `EndPoint not available: ${req.method} ${
//       req.originalUrl?.split("?")[0]
//     }`,
//   });
// });

// // Start server
// app.listen(PORT, HOST, () => {
//   console.log(`🚀 Server is running at http://${HOST}:${PORT}`);
// });
