import { Request, Response, NextFunction } from 'express';
import ReviewService from '../services/ReviewService';

export default class ReviewController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.list(req.query);
      res.json(reviews);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Add userId from authenticated user
      const reviewData = {
        ...req.body,
        userId: req.user?.id
      };
      const review = await ReviewService.create(reviewData);
      res.status(201).json(review);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.update(req.params.id, req.body);
      res.json(review);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ReviewService.delete(req.params.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
