import { createClient } from 'redis';

export const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on('error', (error) => {
    console.warn('Redis error (falling back to no-cache):', error.message);
});

let redisReady = false;

export async function connectRedis() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
        redisReady = true;
        console.log('✅ Redis connected');
    } catch (err) {
        redisReady = false;
        console.warn('⚠️  Redis unavailable — running without cache');
    }
}

export async function cacheGet(key) {
    if (!redisReady) return null;
    try {
        return await redisClient.get(key);
    } catch { return null; }
}

export async function cacheSet(key, value, ttl = 60) {
    if (!redisReady) return;
    try {
        await redisClient.set(key, value, { EX: ttl });
    } catch { /* swallow */ }
}
