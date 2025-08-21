import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
}

start();
