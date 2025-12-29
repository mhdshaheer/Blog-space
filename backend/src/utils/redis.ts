import { createClient } from 'redis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Redis Client Configuration
 */
let rawUrl = process.env.REDIS_URL || '';

// --- AUTOMATIC CLEANUP ---
// Common mistake: pasting the full CLI command instead of just the URL
// e.g. "redis-cli --tls -u redis://..."
if (rawUrl.includes('redis-cli')) {
  const urlMatch = rawUrl.match(/u\s+(redis[s]?:\/\/\S+)/);
  if (urlMatch && urlMatch[1]) {
    rawUrl = urlMatch[1];
  } else {
    // Basic fallback: just find where redis:// starts
    const startIndex = rawUrl.indexOf('redis');
    if (startIndex !== -1) {
      rawUrl = rawUrl.substring(startIndex);
    }
  }
}

let REDIS_URL = rawUrl.trim();

if (!REDIS_URL || REDIS_URL === 'redis://localhost:6379') {
  REDIS_URL = 'redis://localhost:6379';
}

// Ensure Cloud connections use TLS (rediss:// instead of redis://)
if (REDIS_URL.includes('upstash.io') && REDIS_URL.startsWith('redis://')) {
  REDIS_URL = REDIS_URL.replace('redis://', 'rediss://');
}

try {
  new URL(REDIS_URL);
} catch (e) {
  REDIS_URL = 'redis://localhost:6379';
}


const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        return new Error('Max retries reached');
      }
      return Math.min(retries * 500, 5000);
    },
  }
});

redisClient.on('error', () => {
  // Silent error handling
});





// Auto-connect to redis
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err: any) {
    // Silent error handling
  }
})();

export { redisClient };
export default redisClient;

