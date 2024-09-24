import { ProductModel } from "./models/productsModel.js";
import { logger } from "../../config/customLogger.js";

export default class MongoDaoManager {
  async getProducts(page = 1, limit = 10, category, sort ) {
    try {
      const filter = category ? { 'category': category } : {};
      const sortOrder = {}
        if (sort) sortOrder.price = sort === 'asc' ? 1 : sort === 'desc' ? -1 : null; 
        const response = await ProductModel.paginate(filter,{page, limit, sort: sortOrder})
      return response;
    } catch (error) {
      logger.error(error);
    }
  };

  async getProductsById(id) {
    try {
      const response = await ProductModel.findById(id);
      return response;
    } catch (error) {
      logger.error(error);
    }
  }

  async addProduct(obj) {
    try {
      const response = await ProductModel.create(obj);
      return response;
    } catch (error) {
      logger.error(error);
    }
  }

  /*async getByCategory(category) {
    try {
      return await ProductModel.find({ category: category })
    } catch (error) {
      throw new Error("errorDAO" + error);
  
  }}*/

  async deleteProduct(id) {
    try {
      const response = await ProductModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      logger.error(error);
    }
  }
}