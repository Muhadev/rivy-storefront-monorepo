import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import validate from '../middlewares/validate';
import { updateUserSchema } from '../validators/users';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';

const router = Router();

router.get('/me', authenticate, rateLimit, logger, UserController.profile);
router.put('/me', authenticate, rateLimit, logger, validate([updateUserSchema]), UserController.update);
router.delete('/me', authenticate, rateLimit, logger, UserController.delete);

export default router;
