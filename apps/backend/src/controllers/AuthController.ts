import { Request, Response, NextFunction } from 'express';
import AuthService from '.././services/AuthService';

class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, user } = await AuthService.login(req.body);
      res.json({ token, user });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.forgotPassword(req.body.email);
      res.json({ message: 'Password reset link sent if email exists.' });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.body.token, req.body.newPassword);
      res.json({ message: 'Password has been reset.' });
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
