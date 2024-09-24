import MongoDaoManager from "../daos/mongodb/productDao.js";
const productDao = new MongoDaoManager();
import { logger } from "../config/customLogger.js";

import {__dirname} from '../utils.js';
//import ProductManager from '../daos/filesystem/manager.js';
//const productDao = new ProductManager(`${__dirname}/data/nuevoProducto.json`);


export const getAll = async (page, limit, category, sort) => {
  try {
    return await productDao.getProducts(page, limit, category, sort);
  } catch (error) {
    logger.error(error);
  }
};

export const getById = async (id) => {
  try {
    return await productDao.getProductsById(id);
  } catch (error) {
    logger.error(error);
  }
};

export const create = async (obj) => {
  try {
    return await productDao.addProduct(obj);
  } catch (error) {
    logger.error(error);
  }
};


export const update = async (id, obj) => {
  try {
    return await productDao.updateProduct(id, obj);
  } catch (error) {
    logger.error(error);
  }
};

export const remove = async (id) => {
  try {
    return await productDao.deleteProduct(id);
  } catch (error) {
    logger.error(error);
  }
};