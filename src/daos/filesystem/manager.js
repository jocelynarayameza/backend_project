import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../../config/customLogger.js";


export default class ProductManager {
    constructor(path) {
        this.path = path
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const productos = await fs.promises.readFile(this.path, 'utf8');
                return JSON.parse(productos);
            } else return [];
        } catch (error) {
            logger.error(error);
        }

    }

    async addProduct(prod) {
        try {
            const productos = await this.getProducts();
            let newId = uuidv4();
            const nuevoProducto = {
                id: newId,
                status: true,
                ...prod,
            };
            productos.push(nuevoProducto);
            await fs.promises.writeFile(this.path, JSON.stringify(productos));
        } catch (error) {
            logger.error("Error al agregar el producto: " + error.message);
        }
    }
    async getProductsById(id) {
        try {
            const productos = await this.getProducts();
            for (let i = 0; i < productos.length; i++) {
                if (productos[i].id === id) {
                    return productos[i];
                }
            }
        } catch {
            logger.error("No se encontro el producto");
        }
    }

    async updateProduct(id, propiedad, valor) {
        try {
            const productos = await this.getProducts(id);
            const index = productos.findIndex(producto => producto.id === id);

            if (!productos) {
                logger.warning("No se encontro el producto");
            }
            productos[index][propiedad] = valor;
            await fs.promises.writeFile(this.path, JSON.stringify(productos));

        } catch (error) {
            logger.error(error);

        }
    }
    async deleteProduct(id) {
        try {
            const productos = await this.getProducts();
            const index = productos.findIndex(producto => producto.id === id);
            productos.splice(index, 1);
            logger.info(`Producto con id ${id} ha sido eliminado`);

            await fs.promises.writeFile(this.path, JSON.stringify(productos));

        } catch {
            logger.error("No se encontro el producto");
        }

    }
}

