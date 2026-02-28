import "dotenv/config";
import express from "express";
import { connectToDatabase } from "./database/connect-to-database.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

const app = express();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
app.use(cors({origin: "http://localhost:3000", credentials: true})); // to allow cross-origin requests

// Express middleware that parses incoming JSON request bodies.
app.use(express.json()); // to parse incoming requests with JSON payloads (req.body)
// You’re telling Express: For every incoming request, if the Content-Type is application/json, parse the body.

app.use(cookieParser()); // to parse cookies from incoming requests (req.cookies)

app.use("/api/auth", authRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}

async function start() {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server is up on port: ${PORT}`);
  });
}

start();