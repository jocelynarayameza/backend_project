import { CartsModel } from "./models/cartModel.js";
import { logger } from "../../config/customLogger.js";

export default class CartDaoManager {

    async getCart() {
        try {
            const response = await CartsModel.find({});
            return response;
        } catch (error) {
            logger.error(error);
        }
    }

    async getCartById(id) {
        try {
            const response = await CartsModel.findById(id).populate('products.product');
            return response;
        } catch (error) {
            logger.error(error);
        }
    }

    async createCart() {
        try {
            const newCart = {
                products: []
            };
            const result = await CartsModel.create(newCart);
            return result;
        } catch (error) {
            logger.error(error);
        }
    }

    async saveToCart(idCart, idProduct) {
        try {
            const cart = await CartsModel.findById(idCart);
            if (!cart) {
                return { code: 404, status: 'carrito no encontrado' };
            }
            const productExist = cart.products.find(product => product.product === idProduct);
            if (productExist) {
                productExist.quantity += 1;
            } else {
                cart.products.push({ product: idProduct, quantity: 1 });
            }
            await cart.save();
            return { code: 200, status: 'producto agregado al carrito' };
        } catch (error) {
            logger.error(error, "error en dao");
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const result = await CartsModel.updateOne(
                { _id: cid },
                { $pull: { products: { product: pid } } }
            );
            return result;
        } catch (error) {
            logger.error(error);
        }
    }
    
    async updateCart(cid, products) {
        try {
            const result = await CartsModel.updateOne(
                { _id: cid },
                { products: products }
            );
            return result;
        } catch (error) {
            logger.error(error);
        }
    }
    
    async updateProductQuantity(cid, pid, quantity) {
        try {
            const result = await CartsModel.updateOne(
                { _id: cid, 'products.product': pid },
                { $set: { 'products.$.quantity': quantity } }
            );
           return result;
        } catch (error) {
            logger.error(error);
        }
    }

    async removeAllProductsFromCart(cid) {
        try {
            const result = await CartsModel.updateOne(
                { _id: cid },
                { products: [] }
            );
            return result;
        } catch (error) {
            logger.error(error);
        }
    }
}
