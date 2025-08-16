import { Request, Response, NextFunction } from 'express';

export default function retryMiddleware(retries = 2, delay = 100) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let attempts = 0;
    const originalSend = res.send;
    res.send = function (...args) {
      res.send = originalSend;
      return originalSend.apply(this, args);
    };
    async function attempt() {
      try {
        await next();
      } catch (err) {
        if (attempts < retries && req.method === 'GET') {
          attempts++;
          setTimeout(attempt, delay);
        } else {
          next(err);
        }
      }
    }
    attempt();
  };
}
