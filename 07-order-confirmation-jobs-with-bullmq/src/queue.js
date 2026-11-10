import { Queue } from "bullmq";

const queue = new Queue("order-confirmation", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});

const emailQue = new Queue("email", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});



export { queue, emailQue };
