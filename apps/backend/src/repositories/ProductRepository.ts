import Product from '../models/Product';
import { Op, WhereOptions } from 'sequelize';
import Category from '../models/Category';

interface ProductQuery {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId?: number;
  imageUrl?: string;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
}

class ProductRepository {
  static async getAll({ page, limit, search, category, minPrice, maxPrice }: ProductQuery) {
    const where: WhereOptions = {};
    
    if (search) {
      (where as any)[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (category) where.categoryId = Number(category);
    if (minPrice) where.price = { [Op.gte]: minPrice };
    if (maxPrice) where.price = { ...where.price as any, [Op.lte]: maxPrice };
    
    const offset = (page - 1) * limit;
    
    const result = await Product.findAndCountAll({ 
      where, 
      limit, 
      offset,
      include: [{ 
        model: Category, 
        as: 'category'
      }],
      order: [['name', 'ASC']]
    });
    
    return {
      products: result.rows,
      pagination: {
        page,
        limit,
        total: result.count,
        totalPages: Math.ceil(result.count / limit),
        hasNext: page < Math.ceil(result.count / limit),
        hasPrevious: page > 1
      }
    };
  }

  // getById to include category:
  static async getById(id: number) {
    return Product.findByPk(id, {
      include: [{ 
        model: Category, 
        as: 'category' 
      }]
    });
  }

  static async create(data: CreateProductData) {
    const product = await Product.create(data);
    return product.get({ plain: true });
  }

  static async update(id: number, data: UpdateProductData) {
    const product = await Product.findByPk(id);
    if (!product) return null;
    await product.update(data);
    return product.get({ plain: true });
  }

  static async delete(id: number) {
    const product = await Product.findByPk(id);
    if (!product) return false;
    await product.destroy();
    return true;
  }
}

export default ProductRepository;
