import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const productsSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true,
    
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        required: true
    },

    owner: {
        type: String,
        default: 'admin' 
    }
})

productsSchema.plugin(mongoosePaginate)

export const ProductModel = model('products', productsSchema);