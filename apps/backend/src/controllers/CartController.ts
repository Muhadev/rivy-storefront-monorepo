import { Request, Response, NextFunction } from 'express';
import CartService from '../services/CartService';

class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await CartService.getCart(req.user!.id);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const item = await CartService.addItem(req.user!.id, productId, quantity);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }

  static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params; // Get from params, not body
      const { quantity } = req.body;    // Only quantity from body
      const item = await CartService.updateItem(req.user!.id, Number(productId), quantity);
      if (!item) return res.status(404).json({ error: 'Item not found' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const success = await CartService.removeItem(req.user!.id, parseInt(productId));
      if (!success) return res.status(404).json({ error: 'Item not found' });
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      await CartService.clearCart(req.user!.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default CartController;
