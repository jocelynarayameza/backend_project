import messageManager from "../daos/mongodb/chatDao";
import { logger } from "../config/customLogger";
const chatDao = new messageManager();

export const getMessages = async () => {
    try {
        return await chatDao.getMessages();
    } catch (error) {
        logger.error(error);
    }
}

export const addMessages = async (messages) => {
    try {
        return await chatDao.addMessages(messages);
    } catch (error) {
        logger.error(error);
    }
};
