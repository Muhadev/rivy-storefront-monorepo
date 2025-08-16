import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import CategoryController from '../controllers/CategoryController';
import validate from '../middlewares/validate';
import { createProductSchema, updateProductSchema, listProductsQuery } from '../validators/products';
import rateLimit from '../middlewares/rateLimit';
import logger from '../middlewares/logging';
import retryMiddleware from '../middlewares/retry';
import { adminOnly, authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', retryMiddleware(), rateLimit, logger, validate([listProductsQuery]), ProductController.getAll);
router.get('/categories', retryMiddleware(), rateLimit, logger, CategoryController.advancedList);
router.get('/:id', retryMiddleware(), rateLimit, logger, ProductController.getById);
router.post('/', authenticate, adminOnly, rateLimit, logger, validate([createProductSchema]), ProductController.create);
router.put('/:id', authenticate, adminOnly, rateLimit, logger, validate([updateProductSchema]), ProductController.update);
router.delete('/:id', authenticate, adminOnly, rateLimit, logger, ProductController.delete);

export default router;
