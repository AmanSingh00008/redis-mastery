import express from "express";
import redis from "ioredis";
import { createClient } from "redis";
import mongoose from "mongoose";

const app = express();
const redisClient = new redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

app.get("/Redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ message: "Hello World!", redis: reply });
});

app.get("/mongo", async (req, res) => {
  const URL = process.env.MONGO_URL || "mongodb://localhost:27017/root";
  if (!mongoose.connection.readyState) {
    await mongoose.connect(URL);
  }
  res.json({
    message: "Connected",
    mongo: URL,
    DATABASE: mongoose.connection.db.databaseName,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

