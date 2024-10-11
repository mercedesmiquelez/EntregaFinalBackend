import productsServices from "../services/products.services.js";
import { logger } from "../utils/logger.js";
import { sendMail } from "../utils/sendMails.js";

// Para obtener los productos
const getAll = async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;
    const options = {
      limit: limit || 10,
      page: page || 1,
      sort: {
        price: sort === "asc" ? 1 : -1,
      },
      lean: true,
    };

    if (status) {
      const products = await productsServices.getAll({ status: status }, options);
      return res.status(200).json({ status: "success", products });
    }

    if (category) {
      const products = await productsServices.getAll({ category: category }, options);
      return res.status(200).json({ status: "success", products });
    }

    const products = await productsServices.getAll({}, options);

    res.status(200).json({ status: "success", products });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para obtener el producto por el id
const getById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productsServices.getById(pid);
    res.status(200).json({ status: "success", payload: product });
  } catch (error) {
    next(error);
  }
};

// Para crear un nuevo producto
const create = async (req, res) => {
  try {
    const product = req.body;
    const newProduct = await productsServices.create(product, req.user);

    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para actualizar el producto
const update = async (req, res) => {
  try {
    const { pid } = req.params;
    const productData = req.body;

    const updateProduct = await productsServices.update(pid, productData);
    if (!updateProduct) return res.status(404).json({ status: "Error", msg: `Producto con el id ${pid} no encontrado` });

    res.status(200).json({ status: "success", payload: updateProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para eliminar un producto
const deleteOne = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productsRepository.getById(pid);
    if (!product) return res.status(404).json({ status: "Error", msg: `Producto con el id ${pid} no encontrado` });

    if (product.owner && product.owner.role === "premium") {
      await sendMail(
        product.owner.email,
        "Producto eliminado",
        `El producto con el código ${product.code} ha sido eliminado`
      );
    }

    await productsRepository.deleteOne(pid);
    res.status(200).json({ status: "success", payload: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ status: "Error", msg: "Error al eliminar producto" });
  }
};

export default {
  getAll,
  getById,
  update,
  deleteOne,
  create,
};