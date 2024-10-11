//El controlador recibe todas las request que tenemos y da las respuestas al cliente:

import cartsServices from "../services/carts.services.js";
import ticketServices from "../services/ticket.services.js";

// Para crear un carrito
const createCart = async (req, res) => {
  try {
    const cart = await cartsServices.createCart();

    res.status(201).json({ status: "success", payload: cart }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para añadir un producto al carrito
const addProductToCart = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.addProductToCart(cid, pid, req.user);

    res.status(200).json({ status: "success", payload: cart }); // se muestra el carrito con el id correspondiente
  } catch (error) {
    next(error);
  }
};

// Para actualizar la cantidad de productos en el carrito
const updateQuantityProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartsServices.updateQuantityProductInCart(cid, pid, quantity);

    res.status(200).json({ status: "success", payload: cart });  // se muestra el carrito con el id correspondiente
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para eliminar un producto del carrito
const deleteProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartsServices.deleteProductInCart(cid, pid);
    res.status(200).json({ status: "success", payload: cart });// se muestra el carrito con el id correspondiente
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Solicitud de un carrito por el id
const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getCartById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart });// se muestra el carrito con el id correspondiente
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Para eliminar todos los productos del carrito
const deleteAllProductsInCart = async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await cartsServices.deleteAllProductsInCart(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });

    res.status(200).json({ status: "success", payload: cart }); // se muestra el carrito con el id correspondiente
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

// Compras en carrito
const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsServices.getCartById(cid);
    if (!cart) return res.status(404).json({ status: "Error", msg: `No se encontró el carrito con el id ${cid}` });
    const total = await cartsServices.purchaseCart(cid);
    const ticket = await ticketServices.createTicket(req.user.email, total);

    res.status(200).json({ status: "success", payload: ticket });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
};

export default {
  createCart,
  addProductToCart,
  updateQuantityProductInCart,
  deleteProductInCart,
  getCartById,
  deleteAllProductsInCart,
  purchaseCart,
};