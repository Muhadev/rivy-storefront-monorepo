import { Request, Response, NextFunction } from 'express';
import { User, Product, Order, Review, Discount, OrderItem } from '../models';
import { Op } from 'sequelize';
import { sequelize } from '../db';

class AdminController {
  // Get dashboard data for admin
  static async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;

      // Get counts for admin's own data
      const [
        totalProducts,
        totalOrders,
        totalCustomers,
        totalReviews,
        totalDiscounts,
        recentOrders,
        lowStockProducts
      ] = await Promise.all([
        // Products created by this admin
        Product.count({ where: { createdBy: adminId } }),
        
        // Orders for products created by this admin
        Order.count({
          include: [{
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              where: { createdBy: adminId }
            }]
          }]
        }),
        
        // Total customers (all users with customer role)
        User.count({ where: { role: 'customer' } }),
        
        // Reviews for products created by this admin
        Review.count({
          include: [{
            model: Product,
            where: { createdBy: adminId }
          }]
        }),
        
        // Discounts created by this admin (if we add createdBy field later)
        Discount.count(),
        
        // Recent orders for admin's products
        Order.findAll({
          include: [{
            model: OrderItem,
            as: 'items',
            include: [{
              model: Product,
              where: { createdBy: adminId }
            }]
          }],
          order: [['createdAt', 'DESC']],
          limit: 5
        }),
        
        // Low stock products created by this admin
        Product.findAll({
          where: {
            createdBy: adminId,
            stock: { [Op.lte]: 5 }
          },
          limit: 5
        })
      ]);

      res.json({
        stats: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalReviews,
          totalDiscounts
        },
        recentOrders,
        lowStockProducts
      });
    } catch (err) {
      next(err);
    }
  }

  // Get all customers (users with customer role)
  static async getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause = {
        role: 'customer',
        ...(search && {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } }
          ]
        })
      };

      const { count, rows: customers } = await User.findAndCountAll({
        where: whereClause,
        attributes: ['id', 'name', 'email', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      res.json({
        customers,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get customer by ID
  static async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await User.findOne({
        where: { 
          id: req.params.id,
          role: 'customer'
        },
        attributes: ['id', 'name', 'email', 'createdAt'],
        include: [{
          model: Order,
          attributes: ['id', 'total', 'status', 'createdAt']
        }]
      });

      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json(customer);
    } catch (err) {
      next(err);
    }
  }

  // Get products created by the admin
  static async getAdminProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;
      const { page = 1, limit = 10, search = '', category } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const whereClause: any = { createdBy: adminId };
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (category) {
        whereClause.categoryId = category;
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: [{
          model: Review,
          attributes: ['rating']
        }],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset
      });

      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count,
          pages: Math.ceil(count / Number(limit))
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Get product statistics for admin
  static async getProductStats(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;

      const stats = await Product.findAll({
        where: { createdBy: adminId },
        attributes: [
          'id',
          'name',
          'stock',
          'price',
          [sequelize.fn('COUNT', sequelize.col('reviews.id')), 'reviewCount'],
          [sequelize.fn('AVG', sequelize.col('reviews.rating')), 'avgRating']
        ],
        include: [{
          model: Review,
          attributes: []
        }],
        group: ['Product.id'],
        order: [['createdAt', 'DESC']]
      });

      res.json(stats);
    } catch (err) {
      next(err);
    }
  }

  // Get order statistics for admin
  static async getOrderStats(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.user!.id;

      const stats = await Order.findAll({
        include: [{
          model: OrderItem,
          as: 'items',
          include: [{
            model: Product,
            where: { createdBy: adminId }
          }]
        }],
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('total')), 'totalRevenue']
        ],
        group: ['status']
      });

      res.json(stats);
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
