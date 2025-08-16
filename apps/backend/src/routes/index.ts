import { Router } from 'express';
import auth from './auth';
import products from './products';
import cart from './cart';
import reviews from './reviews';
import discounts from './discounts';
import checkout from './checkout';
import orders from './orders';
import users from './users';
import { authenticate } from '../middlewares/auth';
import HealthController from '../controllers/HealthController';
import '../models'; // init associations

export const router = Router();

// Health check endpoints for monitoring and orchestration
router.get('/health', HealthController.healthCheck);
router.get('/health/readiness', HealthController.readinessCheck);
router.get('/health/liveness', HealthController.livenessCheck);

// Legacy simple health check for backwards compatibility
router.get('/health/simple', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId
  });
});

router.use('/auth', auth);
router.use('/products', products);
router.use('/cart', authenticate, cart);
router.use('/reviews', authenticate, reviews);
router.use('/discounts', discounts);
router.use('/checkout', authenticate, checkout);
router.use('/orders', authenticate, orders);
router.use('/users', authenticate, users);
