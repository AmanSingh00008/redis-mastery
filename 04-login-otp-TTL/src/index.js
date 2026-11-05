import express from "express";
import redis from "ioredis";

const app = express();
app.use(express.json());

const Redis = new redis(process.env.REDIS_URL || "redis://localhost:6379");

function otpkey(phone) {
  return `otp:${phone}`;
}

app.post("/otp", async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Redis.set(otpkey(phone), otp, "EX", 60); // Set OTP with a TTL of 60 seconds
  res.json({ message: "OTP sent successfully" });
});

app.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res
        .status(400)
        .json({ error: "Phone number and OTP are required" });
    }

    const storedOtp = await Redis.get(otpkey(phone));

    // Check if OTP exists (expired or never sent)
    if (!storedOtp) {
      return res
        .status(400)
        .json({ error: "OTP has expired or does not exist." });
    }

    // Validate OTP match
    if (storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid OTP." });
    }

    // OTP is valid!
    // Security Best Practice: Delete the OTP immediately after successful verification
    // to prevent reuse attacks.
    await Redis.del(redisKey);

    // TODO: Generate JWT token or create user session here

    return res.status(200).json({
      message: "OTP verified successfully. You are now logged in.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/otp/ttl", async(req, res) => {
  const ttl = await redis.ttl(otpkey(req.params.phone))
  res.json({ttl})
})


app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
