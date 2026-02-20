import mongoose from "mongoose";

export async function connectToDatabase() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if(conn) console.log(`MongoDB connected. ${conn.connection.host}`)
  } catch (error) {
    console.log("Connecting to mongodb failed", error);
    process.exit(1);
  }
}