import redis from "ioredis";

const subscriber = new redis(process.env.REDIS_URL || "redis://localhost:6379");

subscriber.subscribe("notifications", (err) => {
  if (err) {
    console.log("Failed to subscribe: %s", err.message);
    return;
  }
  console.log("Subscribed to notifications channel");
});
subscriber.on("message", (receivedChannel, message) => {
  console.log("\nMessage received!");
});
