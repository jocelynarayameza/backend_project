import { __dirname } from '../utils.js'
import * as service from "../services/cartServices.js"
import UserDao from "../daos/mongodb/userDao.js";
import { UserModel } from '../daos/mongodb/models/userModel.js';
import errorHandler from "../errorHandler.js";
import { cartError } from "../errorMessages.js";
import * as product from "../services/productServices.js"

const userDao = new UserDao(UserModel);

export const create = async (req, res) => {

  try {
    const cart = await service.create();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Error" })
  }
};

export const getAll = async (req, res) => {
  try {
    const cart = await service.getAll();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ msg: "Error" })
  }
};
export const getById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await service.getById(cid);
    if (cart) {
      res.send({ status: "success", payload: cart });
    } else {
      errorHandler.createError({
        name: "Find Cart Error",
        cause: cartError(cid),
        message: "Error buscando carrito",
      })
    }
  } catch (error) {
    res.status(500).json({ msg: "Error en controller" })
  }
};

export const saveToCart = async (req, res) => {
  try {
    const { cid } = req.params
    const { id } = req.params;
    const producto = await product.getById(id);
    if (producto.owner == userId && req.user.role == 'premium') {
			req.logger.info(`El usuario premium ${userId} intentó agregar su propio producto ${id} al carrito ${cid}`);
			res.status(400).json({status:'error: un usuario premium no puede agregar su propio producto al carrito'})
    }else{
    const response = await service.saveToCart(cid, id);
    res.json(response)}
  } catch (error) {
    res.status(500).json({ msg: "Error en controller" })

  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cid, id } = req.params;
    const response = await service.deleteProductFromCart(cid, id);
    res.json(response);
  } catch (error) {
    res.status(500).json({ msg: "Error en controller: " + error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await service.updateCart(cid, req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ msg: "Error en controller: " + error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, id } = req.params;
    const response = await service.updateProductQuantity(cid, id, req.body.quantity);
    res.json(response);
  } catch (error) {
    res.status(500).json({ msg: "Error en controller: " + error.message });
  }
};

export const removeAllProductsFromCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const response = await service.removeAllProductsFromCart(cid);
    res.json(response);
  } catch (error) {
    res.status(500).json({ msg: "Error en controller: " + error.message });
  }
}


export const purchaseCartControllers = async (req, res) => {
  const { cid } = req.params;
  const user = await userDao.getByCartId(cid)
  try {
    if (!user) {
      console.log("req.user está indefinido");
      return res.status(400).json({ error: "Usuario no autenticado" });
    }
    const cart = await service.getById(cid);
    const productsToUpdate = [];
    const productsToKeep = [];

    for (const item of cart.products) {
      const product = item.product;
      const quantityInCart = item.quantity;

      if (product.stock >= quantityInCart) {
        product.stock -= quantityInCart;
        productsToUpdate.push(product);
      } else {
        productsToKeep.push(item);
      }
    }


    await Promise.all(productsToUpdate.map((product) => service.updateProductQuantity(product._id, product)));

    await service.updateCart(cid, productsToKeep);

    const totalAmount = productsToUpdate.reduce((total, product) => {
      const quantityInCart = cart.products.find(item => item.product.equals(product._id)).quantity;
      const productPrice = product.price;
      return total + productPrice * quantityInCart;
    }, 0);


    const ticket = {
      code: `${Math.floor(Math.random() * 1000)}`,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: user.email || "usuario"
    };

    const createdTicket = await service.createTicket(ticket);

    return res.status(200).json({
      ticket: createdTicket,

    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Ocurrió un error en el servidor" })
  }
}
