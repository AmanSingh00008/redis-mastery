import express from 'express';
import redis from 'ioredis';
import { createClient } from 'redis';
import mongoose from 'mongoose';

const app = express();
const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

app.get('/', async (req, res) => {

    const reply = await redis.ping()
    res.json({ message: 'Hello World!', redis: reply });

})
