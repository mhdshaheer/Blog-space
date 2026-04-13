import { createClient } from 'redis';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

/**
 * Redis Client Configuration
 * Handles potential user input errors like pasting the full redis-cli command.
 */
let rawUrl = process.env.REDIS_URL || '';

// Multi-step cleanup for the URL
if (rawUrl.includes('redis-cli')) {
  // Regex to find the URL part starting with redis:// or rediss://
  const urlMatch = rawUrl.match(/(redis[s]?:\/\/\S+)/);
  if (urlMatch && urlMatch[1]) {
    rawUrl = urlMatch[1];
  } else {
    // Fallback: search for the index of 'redis://' to start there
    const startIndex = rawUrl.indexOf('redis://');
    const secureStartIndex = rawUrl.indexOf('rediss://');
    
    if (secureStartIndex !== -1) {
      rawUrl = rawUrl.substring(secureStartIndex);
    } else if (startIndex !== -1) {
      rawUrl = rawUrl.substring(startIndex);
    }
  }
}

let REDIS_URL = rawUrl.trim();

// Ensure Cloud connections use TLS (rediss:// instead of redis://)
// Upstash and other managed Redis providers generally require TLS on their public endpoints
if (REDIS_URL.includes('upstash.io') && REDIS_URL.startsWith('redis://')) {
  REDIS_URL = REDIS_URL.replace('redis://', 'rediss://');
}

// Final check for empty or invalid URL
if (!REDIS_URL || REDIS_URL === 'redis://localhost:6379') {
  REDIS_URL = 'redis://localhost:6379';
}

console.log('\x1b[33m[REDIS] Attempting to connect with URL:', REDIS_URL.replace(/:[^:@]+@/, ':****@'), '\x1b[0m');

const redisClient = createClient({
  url: REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      // Exponential backoff with a cap of 5 seconds
      if (retries > 10) {
        console.error('\x1b[31m[REDIS] Max retries reached. Connection failed.\x1b[0m');
        return new Error('Max retries reached');
      }
      const delay = Math.min(retries * 500, 5000);
      return delay;
    },
    // Adding reasonable timeouts
    connectTimeout: 10000, 
  }
});

redisClient.on('error', (err) => {
  // If we get a DNS error, it's likely a configuration issue
  if (err.message.includes('ENOTFOUND')) {
    console.error('\x1b[31m[REDIS] DNS Error: Hostname could not be resolved. Please check your REDIS_URL in .env\x1b[0m');
  } else {
    console.error('\x1b[31m[REDIS] Client error:', err.message, '\x1b[0m');
  }
});

redisClient.on('connect', () => {
  console.log('\x1b[36m[REDIS] Initializing connection...\x1b[0m');
});

redisClient.on('ready', () => {
  console.log('\x1b[36m[REDIS] Client is ready to use\x1b[0m');
});

// Auto-connect to redis
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('\x1b[36m[REDIS] Connected successfully\x1b[0m');
    }
  } catch (err: unknown) {
    // If it's a cloud connection and it fails, suggest using localhost
    if (REDIS_URL.includes('upstash.io')) {
      console.warn('\x1b[33m[REDIS] TIP: If your cloud Redis is unavailable, you can use "redis://localhost:6379" in your .env\x1b[0m');
    }
  }
})();

export { redisClient };
export default redisClient;


