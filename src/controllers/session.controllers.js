import { userResponseDto } from "../dto/user-response.dto.js";
import { createToken } from "../utils/jwt.js";

const register = async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario registrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const user = req.user;
    const token = createToken(user);
    res.cookie("token", token, { httpOnly: true });
    const userDto = userResponseDto(user);
    return res.status(200).json({ status: "success", payload: userDto, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const current = (req, res) => {
  try {
    const user = userResponseDto(req.user); //DTO va a filtrar toda la informacion del usuario
    return res.status(200).json({ status: "success", payload: user });  //Devolvemos en el payload el user filtrado por el DTO
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const loginGoogle = async (req, res) => {
  try {
    return res.status(200).json({ status: "success", payload: req.user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy();

    res.status(200).json({ status: "success", msg: "Sesión cerrada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
};

export default {
  register,
  login,
  current,
  loginGoogle,
  logout,
};