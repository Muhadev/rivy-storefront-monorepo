import ProductRepository from '.././repositories/ProductRepository';

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
  createdBy: number;
}

interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  imageUrl?: string;
}

class ProductService {
  static async getAll(query: ProductQuery & { createdBy?: number }) {
    return ProductRepository.getAll(query);
  }

  static async getById(id: number) {
    return ProductRepository.getById(id);
  }

  static async create(data: CreateProductData) {
    return await ProductRepository.create(data);
  }

  static async update(id: number, data: UpdateProductData, userId: number) {
    return await ProductRepository.update(id, data, userId);
  }

  static async delete(id: number, userId: number) {
    return await ProductRepository.delete(id, userId);
  }
}

export default ProductService;
