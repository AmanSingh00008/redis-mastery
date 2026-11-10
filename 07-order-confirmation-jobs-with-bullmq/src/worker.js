import { Worker } from 'bullmq';
import { queue, emailQue } from './queue.js';

const emailWorker = async (job) => {
  console.log(`Sending email to ${job.data.email}, job id: ${job.id}, job name: ${job.name}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
};

{queue, emailQue}

const worker = new Worker('emails', emailWorker);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

worker.on("failes", (job, err) => {
    console.log(`Job ${job.id} has failed with ${err.message}`);
})