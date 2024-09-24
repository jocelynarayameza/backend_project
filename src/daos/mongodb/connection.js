import 'dotenv/config'
import mongoose from "mongoose";
import { logger } from '../../config/customLogger.js';
//const stringLocal = "mongodb://127.0.0.1/backendCoder";

const MONGO_URL = process.env.MONGO_URL
export const connectMongoDB = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(MONGO_URL);
        logger.info("Conectado con éxito a MongoDB");
    } catch (error) {
        logger.fatal(error);
    }
};

