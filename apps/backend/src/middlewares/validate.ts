import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validateQuery = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.query = schema.parse(req.query);
    next();
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: err.errors });
    } else {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: 'Unknown validation error' });
    }
  }
};

export const validateBody = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: err.errors });
    } else {
      res.status(400).json({ error: 'VALIDATION_ERROR', details: 'Unknown validation error' });
    }
  }
};

// Default export for compatibility with express-validator style usage
const validate = (schemas: AnyZodObject[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const schema of schemas) {
      try {
        if (schema && typeof schema.parse === 'function') {
          // Only validate body data for these schemas
          req.body = schema.parse(req.body);
        }
      } catch (err: unknown) {
        if (err instanceof ZodError) {
          return res.status(400).json({ error: 'VALIDATION_ERROR', details: err.errors });
        } else {
          return res.status(400).json({ error: 'VALIDATION_ERROR', details: 'Unknown validation error' });
        }
      }
    }
    next();
  };
};

export default validate;
