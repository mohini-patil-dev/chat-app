import redis from 'ioredis';

export const redisClient = new redis(process.env.REDIS_URL!);

redisClient.on('connect', () => {
    console.log('Redis client connected...');
});

redisClient.on('ready', () => {
    console.log('Redis client is ready...');
});

redisClient.on('error', (err) => {
    console.log('Something went wrong ' + err);
    process.exit(1);
});
