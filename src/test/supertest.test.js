import * as chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const request = supertest('http://localhost:8080');

describe('Test del ecommerce', () => {
    describe('products test', () => {
        it('Debería retornar un listado de productos', async () => {
            const res = await request.get('/api/productos');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
          });
    })
    describe('cart test', () => {
        it('Debería retornar un listado de carritos', async () => {
            const res = await request.get('/api/cart');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
          });
    })

    describe('session test', () => {
        it('Debería retornar info de la sesión después de registrarse o iniciar sesión', async () => {
            const res = await request.get('/users/info');
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
          });
    })
})