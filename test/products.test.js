import { expect } from "chai";
import supertest, { agent } from "supertest";
import envConfig from "../src/config/env.config.js";

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test products", () => {
    let cookie;
    before(async () => {
        const loginUser = {
            email: "useradmin@test.com",
            password: "12345",
        };

        const { headers } = await requester.post("/api/session/login").send(loginUser);

        const cookieResult = headers["set-cookie"][0];

        cookie = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        };
    });

    let productId;

    it("[POST] /api/products this endpoint must create a product", async () => {
        const newProduct = {
            title: "Producto Test",
            description: "Este es un producto de prueba",
            price: 200,
            thumbnail: ["http://www.google.com/img"],
            code: "ABC123",
            stock: 50,
            category: "otros",
        };

        const { status, _body, ok } = await requester
            .post("/api/products")
            .send(newProduct)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        productId = _body.payload._id;

        expect(status).to.be.equal(201);
        expect(ok).to.be.equal(true);
        expect(_body.payload.title).to.be.equal("Producto Test");
    });

    it("[GET] /api/products/:pid this endpoint must return one product", async () => {
        const { status, _body, ok } = await requester.get(`/api/products/${productId}`);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.title).to.be.equal("Producto Test");
    });

    it("[GET] /api/products/ this endpoint must return all products", async () => {
        const { status, _body, ok } = await requester.get(`/api/products`);
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.products.docs).to.be.an("array");
    });

    it("[PUT] /api/products/:pid this endpoint must update a product", async () => {
        const updateData = {
            title: "test update",
            description: "product test update",
        };

        const { status, _body, ok } = await requester
            .put(`/api/products/${productId}`)
            .send(updateData)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.payload.title).to.be.equal("test update");
        expect(_body.payload.description).to.be.equal("product test update");
    });

    it("[DELETE] /api/products/:pid this endpoint must delete a product", async () => {
        const { status, _body, ok } = await requester
            .delete(`/api/products/${productId}`)
            .set("Cookie", [`${cookie.name}=${cookie.value}`]);
        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
    });
});