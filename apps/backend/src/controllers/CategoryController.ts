import { Request, Response, NextFunction } from 'express';
import Category from '../models/Category';
import { WhereOptions } from 'sequelize';
import { z } from 'zod';

class CategoryController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async advancedList(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        q: z.string().optional(),
        sort: z.enum(['name', 'createdAt']).optional(),
        order: z.enum(['asc', 'desc']).optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        offset: z.coerce.number().int().min(0).optional(),
      });
      const params = schema.parse(req.query);
      const where: WhereOptions = {};
      if (params.name) where.name = params.name;
      if (params.description) where.description = params.description;
      if (params.q) {
        where.name = { $like: `%${params.q}%` };
      }
      const order: [string, string][] = params.sort ? [[params.sort, params.order || 'asc']] : [['name', 'asc']];
      const categories = await Category.findAll({
        where,
        order,
        limit: params.limit,
        offset: params.offset,
      });
      res.json(categories);
    } catch (err) {
      next(err);
    }
  }
}

export default CategoryController;
