import { Request, Response, NextFunction } from 'express';
import DiscountService from '.././services/DiscountService';

export default class DiscountController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const discounts = await DiscountService.list(req.query);
      res.json(discounts);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const discount = await DiscountService.create(req.body);
      res.status(201).json(discount);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const discount = await DiscountService.update(Number(req.params.id), req.body);
      res.json(discount);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await DiscountService.delete(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
