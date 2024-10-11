import mongoose from "mongoose";
import envConfig from "../src/config/env.config.js";
import userRepository from "../src/persistences/mongo/repositories/user.repository.js";
import { expect } from "chai";

mongoose.connect(envConfig.MONGO_URL);

describe("Test User Repository", () => {

    it("Obtener todos los usuarios", async () => { // La función ejecuta todos los test
        const users = await userRepository.getAll();
        expect(users).to.be.an("array");
    });

    let userId;
    let userEmail;

    it("Create user", async () => { //Test para crear un usuario con rol user
        const newUser = {
            firstName: 'User test',
            lastName: 'Test',
            email: 'user-test@test.com',
            password: '123',
            age: 20,    
        };

        const user = await usersRepository.createUser(newUser);
        userId = user._id;
        userEmail = user.email;

        expect(user).to.be.an("object");
        expect(user.firstName).to.equal("User test");
        expect(user.lastName).to.equal("Test");
        expect(user.email).to.equal("user-test@test.com");
        expect(user.password).to.equal("123");
        expect(user.role).to.equal("user");
    });

    it("Create user admin", async () => { //Test para crear un usuario con rol admin
        const newAdmin = {
            firstName: 'Admin test',
            lastName: 'Test',
            email: 'admin-test@test.com',
            password: '123',
            age: 30,
            role: 'admin'    
        };

        const user = await usersRepository.createUser(newAdmin);
        adminId = user._id;
        adminEmail = user.email;

        expect(user).to.be.an("object");
        expect(user.firstName).to.equal("Admin test");
        expect(user.lastName).to.equal("Test");
        expect(user.email).to.equal("admin-test@test.com");
        expect(user.password).to.equal("123");
        expect(user.role).to.equal("admin");
    });

    it("Create user premium", async () => { //Test para crear un usuario con rol premium
        const newPremium = {
            firstName: 'Premium test',
            lastName: 'Test',
            email: 'premium-test@test.com',
            password: '123',
            age: 40,
            role: 'premium'    
        };

        const user = await usersRepository.createUser(newPremium);
        premiumId = user._id;
        premiumEmail = user.email;

        expect(user).to.be.an("object");
        expect(user.firstName).to.equal("Premium test");
        expect(user.lastName).to.equal("Test");
        expect(user.email).to.equal("premium-test@test.com");
        expect(user.password).to.equal("123");
        expect(user.role).to.equal("premium");
    });

    it("Get user by id", async () => { //Test para obtener un usuario por id
        const user = await usersRepository.getUserById(userId);
        expect(user).to.be.an("object");
        expect(user.email).to.equal(userEmail);
        expect(user.password).to.be.an("string");
    });

    it("Get user by email", async () => { //Test para obtener un usuario por email
        const user = await usersRepository.getUserByEmail(userEmail);
        expect(user).to.be.an("object");
        expect(user.email).to.equal(userEmail);
        expect(user.password).to.be.an("string");
    });

    it("Update user", async () => { //Test para actualizar un usuario
        const user = await usersRepository.updateUserById(userId, {
            firstName: "User Update",
            lastName: "Update",
            age: 50,
        });
        expect(user.firstName).to.equal("User Update");
        expect(user.lastName).to.equal("Update");
        expect(user.age).to.not.equal(20);
    });

    it("Delete user", async () => { //Test para borrar un usuario
        await usersRepository.deleteUserById(userId);
        await usersRepository.deleteUserById(adminId);
        await usersRepository.deleteUserById(premiumId);
        const user = await usersRepository.getUserById(userId);
        const admin = await usersRepository.getUserById(adminId);
        const premium = await usersRepository.getUserById(premiumId);
        expect(user).to.be.null;
        expect(admin).to.be.null;
        expect(premium).to.be.null;
    });

    after(async () => {
        console.log("This line will be executed after all tests");
        mongoose.disconnect();
    })
})