import { expect } from "chai";
import supertest from "supertest";
import envConfig from "../src/config/env.config.js";
import mongoose from "mongoose";
import { userModel } from "../src/persistences/mongo/models/user.model.js";
mongoose.connect(envConfig.MONGO_URL);

const requester = supertest(`http://localhost:${envConfig.PORT}`);

describe("Test of Session Endpoints", () => { // La función ejecuta todos los test de los endpoints
    
    it("[POST] /api/sessions/register - This endpoint should register a user", async () => {
        // Se registra un nuevo usuario con rol user
        const newUser = {
            firstName: 'User test',
            lastName: 'Test',
            email: 'user-test@test.com',
            password: '123',
            age: 20,    
        };
        
        const { status, _body, ok } = await requester.post("/api/sessions/register").send(newUser);
        expect(status).to.be.equal(201);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");

        // Se registra un nuevo usuario con rol admin
        const newAdmin = {
            firstName: 'Admin test',
            lastName: 'Test',
            email: 'admin-test@test.com',
            password: '123',
            age: 30,
            role: 'admin'    
        };
        
        const { status: statusAdmin, _body: _bodyAdmin, ok: okAdmin } = await requester.post("/api/sessions/register").send(newAdmin);
        expect(statusAdmin).to.be.equal(201);
        expect(okAdmin).to.be.equal(true);
        expect(_bodyAdmin.status).to.be.equal("success");
        
        // Se registra un nuevo usuario con rol premium
        const newPremium = {
            firstName: 'Premium test',
            lastName: 'Test',
            email: 'premium-test@test.com',
            password: '123',
            age: 40,
            role: 'premium'    
        };
        
        const { status: statusPremium, _body: _bodyPremium, ok: okPremium } = await requester.post("/api/sessions/register").send(newPremium);
        expect(statusPremium).to.be.equal(201);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.status).to.be.equal("success");
    });
    
    let cookieUser;
    let cookieAdmin;
    let cookiePremium;
    it("[POST] /api/sessions/login - This endpoint should login a user", async () => {
        // Se logea un usuario con rol user
        const loginUser = {
            email: 'user-test@test.com',
            password: '123',
        };

        const { status, _body, ok, headers } = await requester.post("/api/sessions/login").send(loginUser);
        const cookieResult = headers["set-cookie"][0];
        cookieUser = {
            name: cookieResult.split("=")[0],
            value: cookieResult.split("=")[1],
        }

        expect(status).to.be.equal(200);
        expect(ok).to.be.equal(true);
        expect(_body.status).to.be.equal("success");
        expect(_body.payload.firstName).to.be.equal("User test");
        expect(_body.payload.email).to.be.equal("user-test@test.com");
        expect(_body.payload.role).to.be.equal("user");

        // Se logea un usuario con rol admin
        const loginAdmin = {
            email: 'admin-test@test.com',
            password: '123',
        };
        
        const { status: statusAdmin, _body: _bodyAdmin, ok: okAdmin, headers: headersAdmin } = await requester.post("/api/sessions/login").send(loginAdmin);
        const cookieResultAdmin = headersAdmin["set-cookie"][0];
        cookieAdmin = {
            name: cookieResultAdmin.split("=")[0],
            value: cookieResultAdmin.split("=")[1],
        }

        expect(statusAdmin).to.be.equal(200);
        expect(okAdmin).to.be.equal(true);
        expect(_bodyAdmin.status).to.be.equal("success");
        expect(_bodyAdmin.payload.firstName).to.be.equal("Admin test");
        expect(_bodyAdmin.payload.email).to.be.equal("admin-test@test.com");
        expect(_bodyAdmin.payload.role).to.be.equal("admin");

        // Se logea un usuario con rol premium        
        const loginPremium = {
            email: 'premium-test@test.com',
            password: '123',
        };

        const { status: statusPremium, _body: _bodyPremium, ok: okPremium, headers: headersPremium } = await requester.post("/api/sessions/login").send(loginPremium);
        const cookieResultPremium = headersPremium["set-cookie"][0];
                
        cookiePremium = {
            name: cookieResultPremium.split("=")[0],
            value: cookieResultPremium.split("=")[1],
        }

        expect(statusPremium).to.be.equal(200);
        expect(okPremium).to.be.equal(true);
        expect(_bodyPremium.status).to.be.equal("success");
        expect(_bodyPremium.payload.firstName).to.be.equal("Premium test");
        expect(_bodyPremium.payload.email).to.be.equal("premium-test@test.com");
        expect(_bodyPremium.payload.role).to.be.equal("premium");
    });

    it("[GET] /api/sessions/current - This endpoint should show the current user", async () => {

        const { status, _body, ok } = await requester.get("/api/sessions/current").set("Cookie", [`${cookieUser.name}=${cookieUser.value}`]);
        expect(ok).to.be.equal(true);
        expect(status).to.be.equal(200);
        expect(_body.payload.email).to.be.equal("user-test@test.com");
        expect(_body.payload.role).to.be.equal("user");

    });

    after(async () => {
        await usersModel.deleteOne({ email: "user-test@test.com" });
        await usersModel.deleteOne({ email: "admin-test@test.com" });
        await usersModel.deleteOne({ email: "premium-test@test.com" });
        mongoose.disconnect();
    });

})
