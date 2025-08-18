import { Request, Response, NextFunction } from 'express';
import ProductService from '../services/ProductService';

class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const { page = 1, limit = 10, q: search = '', category, minPrice, maxPrice } = req.query;
      const products = await ProductService.getAll({
        page: Number(page),
        limit: Number(limit),
        search: String(search),
        category: category ? String(category) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        createdBy: req.user.id,
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
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const productData = { ...req.body, createdBy: req.user.id };
      const product = await ProductService.create(productData);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      // Fetch product to check ownership
      const existingProduct = await ProductService.getById(Number(req.params.id));
      if (!existingProduct || existingProduct.createdBy !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not own this product.' });
      }
      const product = await ProductService.update(Number(req.params.id), req.body, req.user.id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.json(product);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      // Fetch product to check ownership
      const existingProduct = await ProductService.getById(Number(req.params.id));
      if (!existingProduct || existingProduct.createdBy !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden: You do not own this product.' });
      }
      const success = await ProductService.delete(Number(req.params.id), req.user.id);
      if (!success) return res.status(404).json({ error: 'Product not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ProductController;
