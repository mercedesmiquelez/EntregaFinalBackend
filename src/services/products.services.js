import { productResponseDto } from "../dto/product-response.dto.js";
import productsRepository from "../persistences/mongo/repositories/products.repository.js";
import error from "../errors/customErrors.js";
import { sendMail } from "../utils/sendMails.js";

const getAll = async (query, options) => {
    const products = await productsRepository.getAll(query, options);
    return products;
};

const getById = async (id) => {
    const productData = await productsRepository.getById(id);
    if (!productData) throw error.notFoundError(`Product id ${id} not found`);
    const product = productResponseDto(productData);
    return product;
};

const create = async (data, user) => {
    let productData = data;
    if (user.role === "premium") {
        productData = { ...data, owner: user.email };
    }

    const product = await productsRepository.create(productData);
    return product;
};

const update = async (id, data) => {
    const product = await productsRepository.update(id, data);
    return product;
};

const deleteOne = async (id, user) => {
    const productData = await productsRepository.getById(id);
    if (user.role === "premium" && productData.owner !== user.email) {
        throw error.unauthorizedError("User not authorized");
    }

    if(user.role === "admin" && productData.owner !== "admin") {
        await sendMail(productData.owner, "Producto eliminado", `El producto ${productData.title} ha sido eliminado por el usuario administrador`)
    }

    const product = await productsRepository.deleteOne(id);
    return product;
};

export default {
    getAll,
    getById,
    update,
    deleteOne,
    create,
};