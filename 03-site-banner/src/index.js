import express from "express";
import redis from "ioredis";

const app = express();
app.use(express.json());

const redisClient = new redis(
  process.env.REDIS_URL || "redis://localhost:6379",
);

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
    await redisClient.set(BANNER_KEY, req.body.message || "Hello World!");

    res.json({ message: true });
})

app.get("/banner", async (req, res) => {
    const banner = await redisClient.get(BANNER_KEY);
    res.json({ message: banner || "No banner set." });
});

app.delete("/banner", async (req, res) => {
    await redisClient.del(BANNER_KEY);
    res.json({ message: true });
});

app.get("/banner/exists", async (req, res) => {
    const exists = await redisClient.exists(BANNER_KEY);
    res.json({ exists: Boolean(exists) });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});