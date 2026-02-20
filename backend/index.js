import dotenv from "dotenv";

// Load environment variables FIRST before importing other modules
dotenv.config();

import express from "express";
import { connectToDatabase } from "./database/connect-to-database.js";
import authRoutes from './routes/auth-routes.js'

const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Home Page");
})

// Express middleware that parses incoming JSON request bodies.
app.use(express.json()); // to parse incoming requests with JSON payloads (req.body)
// You’re telling Express: For every incoming request, if the Content-Type is application/json, parse the body.

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToDatabase();
  console.log(`Server is up on port: ${PORT}`)
})