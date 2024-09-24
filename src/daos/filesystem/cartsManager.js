import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./manager.js";
import { logger } from "../../config/customLogger.js";

const productManager = new ProductManager("./data/nuevoProducto.json");

export default class CartManager {
  constructor(path) {
    this.path = path;
  }
  async getCart() {
    try {
      if (fs.existsSync(this.path)) {
        const cart = await fs.promises.readFile(this.path, 'utf8');
        return JSON.parse(cart);
      } else return [];
    } catch (error) {
      logger.error(error.message);
    }
  }

  async createCart() {
    try {
      const cart = await this.getCart();
      let newId = uuidv4();
      const newCart = {
        id: newId,
        products: [],
      }
      cart.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(cart));
      return cart;
    } catch (error) {
      logger.error(error.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await this.getCart();
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
          return cart[i];
        }
      }
    } catch (error) {
      logger.error(error.message);
    }
  }

  async saveToCart(idCart, idProduct) {
    try {
      const product = {
        id: idProduct,
        quantity: 1,
      }
      const productExists = await productManager.getProductsById(idProduct);
      if (!productExists) throw new Error;
      const cartExists = await this.getCartById(idCart);
      if (!cartExists) { throw new Error }
      const productInCart = cartExists.products.find((prod) => prod.id === idProduct);
      if (!productInCart) cartExists.products.push(product); else productInCart.quantity++;
      let carts = await this.getCart();
      const updatedCarts = carts.map((cart) => {
        if (cart.id === idCart) return cartExists
        else return cart
      })
      await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
      return cartExists

    } catch (error) {
      logger.error(error.message);
    }
  }

async deleteProductFromCart(idCart, idProduct) {
  try {
    const cartExists = await this.getCartById(idCart);
    if (!cartExists) throw new Error('Carrito no encontrado');
    const productIndex = cartExists.products.findIndex((prod) => prod.id === idProduct);
    if (productIndex === -1) throw new Error('Producto no encontrado en el carrito');
    cartExists.products.splice(productIndex, 1);
    let carts = await this.getCart();
    const updatedCarts = carts.map((cart) => {
      if (cart.id === idCart) return cartExists;
      return cart;
    });
    await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
    return cartExists;
  } catch (error) {
    logger.error(error.message);
  }
}

async updateCart (idCart){
  try {
    const cartExists = await this.getCartById(idCart);
    if (!cartExists) throw new Error('Carrito no encontrado');
    let carts = await this.getCart();
    const updatedCarts = carts.map((cart) => {
      if (cart.id === idCart) return cartExists;
      return cart;
    });
    await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
    return cartExists;
  } catch (error) {
    logger.error(error.message);
  }
}
}