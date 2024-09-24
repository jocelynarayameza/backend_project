import { dirname } from 'path';
import { fileURLToPath } from 'url';
export const __dirname = dirname(fileURLToPath(import.meta.url));
import { faker } from '@faker-js/faker';

import bcrypt from 'bcrypt';


export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);


export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(), 
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.avatar(),
        category: faker.commerce.productMaterial(),
        code: faker.commerce.isbn(),
        stock: faker.number.int(),
        id: faker.database.mongodbObjectId()
    }
}