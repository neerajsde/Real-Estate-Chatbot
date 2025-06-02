import mongoose from "mongoose";

export default async function DBConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}