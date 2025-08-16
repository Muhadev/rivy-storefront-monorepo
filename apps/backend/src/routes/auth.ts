import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import validate from '../middlewares/validate';
import { registerSchema, loginSchema, resetPasswordSchema, forgotPasswordSchema } from '../validators/auth';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';

const router = Router();

router.post('/register', rateLimit, logger, validate([registerSchema]), AuthController.register);
router.post('/login', rateLimit, logger, validate([loginSchema]), AuthController.login);
router.post('/forgot-password', rateLimit, validate([forgotPasswordSchema]), logger, AuthController.forgotPassword);
router.post('/reset-password', rateLimit, validate([resetPasswordSchema]), logger, AuthController.resetPassword);

export default router;
