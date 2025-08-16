import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/OrderService';
import CartService from '../services/CartService';

class CheckoutController {
  static async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const cartItems = await CartService.getCart(userId);
      if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });
      
      // Create order (OrderService handles calculation and inventory management)
      const order = await OrderService.create({
        userId,
        address: req.body.address
      });
      
      res.status(201).json({ order, confirmation: true });
    } catch (err) {
      next(err);
    }
  }
}

export default CheckoutController;
