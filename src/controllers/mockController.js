import { generateProduct } from "../utils.js";

export const getProducts = (req, res) => {
    try {
        let products = [];
        for(let i = 0; i < 100; i++) {
            products.push(generateProduct());
        }
        res.status(200).send({payload: products});
    } catch (error) {

    }
}