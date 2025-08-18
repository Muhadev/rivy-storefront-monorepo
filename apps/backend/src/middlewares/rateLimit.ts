import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX || 1000),
  message: 'Too many requests, please try again later.'
});

// More generous rate limiting for authenticated users
const authenticatedLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: Number(process.env.RATE_LIMIT_MAX_AUTH || 10000), // 5x more requests for authenticated users
  message: 'Too many requests, please try again later.'
});

export default limiter;
export { authenticatedLimiter };
