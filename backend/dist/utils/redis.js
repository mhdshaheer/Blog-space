"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
/**
 * Redis Client Configuration
 * Optimized for Cloud Redis connections (e.g., Upstash, Redis Labs, Aiven)
 */
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
    console.warn('⚠️  REDIS_URL is not defined in .env! Falling back to localhost.');
}
const redisClient = (0, redis_1.createClient)({
    url: REDIS_URL || 'redis://localhost:6379',
    socket: {
        // Automatically uses TLS if the URL starts with rediss://
        reconnectStrategy: (retries) => {
            // Exponential backoff with a cap of 3 seconds
            return Math.min(retries * 100, 3000);
        },
        // For many cloud providers, you might need to explicitly allow unauthorized certs for TLS
        // tls: REDIS_URL?.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
    }
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => {
    console.error('❌ Redis Connection Error:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
        console.warn('💡 Tip: Ensure your Cloud Redis URL and credentials are correct.');
    }
});
redisClient.on('connect', () => console.log('🚀 Redis Client Connecting to Cloud...'));
redisClient.on('ready', () => console.log('✅ Redis Client Ready and Connected'));
// Auto-connect to redis
(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    }
    catch (err) {
        console.error('❌ Failed to connect to Redis:', err.message);
    }
})();
exports.default = redisClient;
//# sourceMappingURL=redis.js.map