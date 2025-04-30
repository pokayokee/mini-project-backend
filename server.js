import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createClient } from "@libsql/client";
import apiRoutes from "./api/v1/routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json())

const db = createClient({
  url: process.env.TURSO_DB_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize the tables (users, notes)
(async () => {
  // Connect to MongDB via Mongoose
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to Mongo database");
  } catch (err) {
    console.error(`MongoDB connection error: ${err}`)
    process.exit(1);
  }

  // Ping Turso
  try {
    await db.execute("SELECT 1");
    console.log("Checked successful communication with Turso database ✅");
  } catch (err) {
    console.error("❌ Failed to connect to Turso:", err);
    process.exit(1);
  }

  // Initialize Turso tables (users, notes)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
    );
  `)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT, --JSON-endcoded array of strings
    is_pinned INTEGER DEFAULT 0, -- 0 = false, 1 = true
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER
    );
  `)
})();

app.use("/", apiRoutes(db));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});