import { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: {
                type: Number
            },
            default: []
        }
    ]
});

export const CartsModel = model('carts', cartSchema);