import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, q: search = '', category, minPrice, maxPrice } = req.query;
      const products = await ProductService.getAll({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        category: category ? String(category) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      });
      res.json(products);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getById(Number(req.params.id));
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.update(Number(req.params.id), req.body);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await ProductService.delete(Number(req.params.id));
      if (!success) return res.status(404).json({ error: 'Product not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ProductController;
