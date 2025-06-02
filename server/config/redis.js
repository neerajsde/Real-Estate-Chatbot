import redis from 'redis';

// Create Redis client (v4+ syntax)
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
    retry_strategy: (options) => {
        console.error(`🔄 Redis reconnecting... Attempt: ${options.attempt}`);
        return Math.min(options.attempt * 100, 3000); // Exponential backoff up to 3 sec
    },
});

// Handle Redis connection events
redisClient.on('connect', () => console.log('✅ Connected to Redis'));
redisClient.on('error', (err) => console.error(`❌ Redis Error: ${err.message}`));
redisClient.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));
redisClient.on('end', () => console.log('🚫 Redis connection closed.'));

// Function to ensure Redis connection
export default async function connectRedis() {
    if (!redisClient.isOpen) {
        try {
            await redisClient.connect();
            console.log('🔗 Redis connection established');
        } catch (err) {
            console.error('❌ Redis connection failed:', err);
        }
    }
}

// Gracefully close Redis on app exit
process.on('SIGINT', async () => {
    try {
        await redisClient.quit();
        console.log('❌ Redis Disconnected');
    } catch (err) {
        console.error('❌ Error while disconnecting Redis:', err);
    } finally {
        process.exit(0);
    }
});

// Export Redis client (connection will be established when used)
export { redisClient };