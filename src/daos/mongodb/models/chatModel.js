import { Schema, model } from "mongoose";

const chatSchema = new Schema({
    userName: String,
    message: String,
});

export const ChatsModel = model('messages', chatSchema);