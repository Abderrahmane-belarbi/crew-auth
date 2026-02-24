import "dotenv/config";
import express from "express";
import { connectToDatabase } from "./database/connect-to-database.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({origin: "http://localhost:3000", credentials: true})); // to allow cross-origin requests

// Express middleware that parses incoming JSON request bodies.
app.use(express.json()); // to parse incoming requests with JSON payloads (req.body)
// You’re telling Express: For every incoming request, if the Content-Type is application/json, parse the body.

app.use(cookieParser()); // to parse cookies from incoming requests (req.cookies)

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/api/auth", authRoutes);

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is up on port: ${PORT}`);
  });
}

start();