// For crash visibility
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

import app from "./app.js";

const PORT = process.env.PORT;
 
if (!PORT) {
  throw new Error("PORT is not defined");
}

// POST + 0.0.0.0 = Proper Railway Networking?
const server = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Clean Shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM Recieved, shutting down...")
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});