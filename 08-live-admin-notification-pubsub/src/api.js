import Redis from 'ioredis';
import express from 'express';

const app = express();

app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.post('/publish/notification', async (req, res) => {
  try {
    const { userId, type, message, priority } = req.body;
    
    const job = await notificationPublisher.publish('push-notification', {
      userId,
      type,
      message,
      priority: priority || 'normal',
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      jobId: job.id,
      message: 'Notification job published successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {    
console.log('API server is running on port http://localhost:3000');
});