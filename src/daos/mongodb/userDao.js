import { UserModel } from "./models/userModel.js";
import { logger } from "../../config/customLogger.js";

export default class UserDao {
    constructor(model){
        this.model = model;
    }

    async getUsers() {
      try {
          const users = await this.model.find()
          return users
      } catch (error) {
        logger.error(error)
      }
  }

    async register(user){
        try {
            const { email } = user;
            const existUser = await this.model.findOne({ email });
            if(!existUser) return await this.model.create(user);
            else return null;
        } catch (error) {
            logger.error(error)
        }
    };

    async getByCartId(cartId) {
        try {
            return await this.model.findOne({ 'carts': cartId });
        } catch (error) {
            logger.error(error);
        }
    }

    async getById(id) {
        try {
          return await UserModel.findById(id).populate('carts');
        } catch (error) {
          logger.error(error);
        }
      }
    async login(email){
        try {
            return await this.model.findOne({ email}); 
        } catch (error) {
            logger.error(error)
        }
    };

    async update(userId, updateData) {
        try {
          // Encuentra el usuario por ID y actualiza con los datos proporcionados
          const updatedUser = await this.model.findByIdAndUpdate(userId, updateData, {
            new: true, // Devuelve el documento actualizado
            runValidators: true // Ejecuta las validaciones del modelo
          });
          return updatedUser;
        } catch (error) {
          throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
      }

      async deleteUsers (filter) {
        try{
            return await this.model.deleteMany(filter)
        }catch (error) {
            console.log(error)
            throw error
        }
    }
}