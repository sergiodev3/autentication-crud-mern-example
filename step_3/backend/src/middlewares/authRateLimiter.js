import rateLimit from 'express-rate-limit';

const windowMinutes = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MINUTES) || 15;
const maxRequests = Number(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 10;

const authRateLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  limit: maxRequests,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many auth attempts. Please try again later.'
  }
});

export default authRateLimiter;
