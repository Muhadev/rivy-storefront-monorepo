import { Request, Response, NextFunction } from 'express';
import UserService from '.././services/UserService';

class UserController {
  static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getById(req.user!.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.update(req.user!.id, req.body);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Check if the authenticated user is an admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Admins only' });
      }
      const users = await UserService.getAll();
      res.json(users);
    } catch (err) {
      next(err);
    }
  }
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const success = await UserService.delete(req.user!.id);
      if (!success) return res.status(404).json({ error: 'User not found' });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
