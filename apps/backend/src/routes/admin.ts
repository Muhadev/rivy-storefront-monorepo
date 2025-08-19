import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth';
import AdminController from '../controllers/AdminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireAdmin);

// Admin dashboard data
router.get('/dashboard', AdminController.getDashboardData);

// Customer management
router.get('/customers', AdminController.getCustomers);
router.get('/customers/:id', AdminController.getCustomerById);

// Admin-specific product management
router.get('/products', AdminController.getAdminProducts);
router.get('/products/stats', AdminController.getProductStats);

// Admin-specific order management
router.get('/orders/stats', AdminController.getOrderStats);

export default router;
