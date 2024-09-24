import CartDaoManager from '../daos/mongodb/cartDao.js';
const cartDao = new CartDaoManager();
import { TicketModel } from '../daos/mongodb/models/ticketModel.js';
import { logger } from '../config/customLogger.js';
import { __dirname } from '../utils.js';
//import CartManager from '../daos/filesystem/cartsManager.js';
//const cartDao = new CartManager(`${__dirname}/data/cart.json`);


export const getAll = async () => {
  try {
    return await cartDao.getCart();
  } catch (error) {
    logger.error(error);
  }
};

export const getById = async (id) => {
  try {
    return await cartDao.getCartById(id);
  } catch (error) {
    logger.error(error);
  }
};

export const create = async (obj) => {
  try {
    return await cartDao.createCart(obj);
  } catch (error) {
    logger.error(error);
  }
};


export const saveToCart = async (cid, id) => {
  try {
    return await cartDao.saveToCart(cid, id);
  } catch (error) {
    logger.error(error, "error en service");
  }
};

export const deleteProductFromCart = async (cid, id) => {
  try {
    return await cartDao.deleteProductFromCart(cid, id);
  } catch (error) {
    logger.error("error en service: " + error.message);
  }
};

export const updateCart = async (cid, id) => {

  try {
    return await cartDao.updateCart(cid, id);
  } catch (error) {
    logger.error("error en service: " + error.message);
  }
}

export const updateProductQuantity = async (cid, pid, quantity) => {
  try {
    return await cartDao.updateProductQuantity(cid, pid, quantity);
  } catch (error) {
    logger.error("error en service: " + error.message);
  }
}

export const removeAllProductsFromCart = async (cid) => {
  try {
    return await cartDao.removeAllProductsFromCart(cid);
  } catch (error) {
    logger.error("error en service: " + error.message);
  }
}

export const createTicket = async (ticketData) => {
  try {
      const result = await TicketModel.create(ticketData);
      return { ticket: result };
  } catch (error) {
    logger.error("error en service: " + error.message);
  }
}
