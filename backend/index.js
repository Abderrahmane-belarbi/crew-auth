import "dotenv/config";
import express from "express";
import { connectToDatabase } from "./database/connect-to-database.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT = process.env.PORT || 5000;

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