import { ChatsModel } from "./models/chatModel.js";
import { logger } from "../../config/customLogger.js";
export default class MessageManager{

    getMessages = async () => {
        try{
            const messages = await ChatsModel.find()
            return messages
        }catch(error){
            logger.error('No hay mensajes para leer',error.message); 
            return error
        }
    }
    addMessages = async (message) => {
        try{
            return await ChatsModel.create(message);
        }catch(error){
            logger.error('No se pudo entregar el mensaje',error.message);
            return error;
        }
    }
}


