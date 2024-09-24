import * as cartService from "../services/cartServices.js"
import { logger } from "../config/customLogger.js";

export const createTicketService = async (user) => {
    try {
        const cart = await cartService.getById(user.carts)

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
    
        await Promise.all(productsToUpdate.map((product) => cartService.updateProductQuantity(product._id, product)));
    
        await cartService.updateCart(cid, productsToKeep);
    
        const totalAmount = productsToUpdate.reduce((total, product) => {
          const quantityInCart = cart.products.find(item => item.product.equals(product._id)).quantity;
          const productPrice = product.price;
          return total + productPrice * quantityInCart;
        }, 0);
    
        const ticket = await cartService.createTicket( {
            code: `${Math.floor(Math.random() * 1000)}`,
            purchase_datetime: new Date(),
            amount: totalAmount,
            purchaser: user.email
          });
        return ticket;

    } catch (error) {
      logger.error(error);
    }
}

