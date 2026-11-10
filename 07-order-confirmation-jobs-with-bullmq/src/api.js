import express from 'express';
import Bull from 'bull';
import { emailQue } from './queue.js';

const app = express();

// Configuration
const config = {
  port: process.env.PORT || 3000,
  redis: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || 'localhost',
    password: process.env.REDIS_PASSWORD || undefined,
  },
  queue: {
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 10,
      removeOnFail: 5,
    },
    limiter: {
      max: 100,
      duration: 1000, // 100 jobs per second
    },
  },
};

app.use(express.json());

app.post('/welcome-email', async (req, res) => {
  try {
    // Add job to the queue with configuration
    const job = await emailQue.add('welcome-email', {
      to: req.body.to,
      subject: req.body.subject,
      // You can add more properties if needed
    }, config.queue.defaultJobOptions);

    // Send success response with job ID
    res.status(201).json({
      success: true,
      jobId: job.id,
      message: 'Welcome email job added successfully'
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Queue status endpoint
app.get('/queue/status', async (req, res) => {
  try {
    const waiting = await emailQue.getWaiting();
    const active = await emailQue.getActive();
    const completed = await emailQue.getCompleted();
    const failed = await emailQue.getFailed();
    
    res.json({
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});