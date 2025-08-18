import { Request, Response, NextFunction } from 'express';
import OrderService from '../services/OrderService';

class OrderController {
  static async confirm(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.params.id);
      const order = await OrderService.confirmOrder(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found or cannot be confirmed' });
      res.json({ id: order.id, status: order.status });
    } catch (err) {
      next(err);
    }
  }
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.create({ ...req.body, userId: req.user!.id });
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getById(Number(req.params.id));
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) { next(err); }
  }
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.update(Number(req.params.id), req.body);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      res.json(order);
    } catch (err) { next(err); }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await OrderService.delete(Number(req.params.id));
      if (!success) return res.status(404).json({ error: 'Order not found' });
      res.status(204).send();
    } catch (err) { next(err); }
  }
  
  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.params.id);
      const order = await OrderService.cancelOrder(orderId, req.user!.id);
      if (!order) return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
      res.json({ id: order.id, status: order.status });
    } catch (err) {
      next(err);
    }
  }
  
  static async listByUser(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.listByUser(req.user!.id);
      res.json(orders);
    } catch (err) {
      next(err);
    }
  }
}
export default OrderController;