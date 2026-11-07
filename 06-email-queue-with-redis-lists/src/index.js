import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const Redis = new redis(process.env.Redis_URL || "redis://localhost:6379");

const QUEUE_key = "queue:emails";

app.post("/send-email", async (req, res) => {
    const job = {
        to: req.body.to,
        subject : req.body.subject || 'No Subject',
        body : req.body.body || 'No content',
        createdAt : new Date().toISOString()
    }

    await Redis.lpush(QUEUE_key, JSON.stringify(job));
    res.status(200).json({ message: "Email queued successfully" });
});

app.get("/emails/process-one", async (req, res) => {
    const job = await Redis.rpop(QUEUE_key);
    if (!job) {
        return res.status(404).json({ message: "No email to process" });
    }
    const email = JSON.parse(job);
    res.status(200).json({ email });
});

app.listen(3000, () => {
    console.log("Server is running on port http://localhost:3000");
});
