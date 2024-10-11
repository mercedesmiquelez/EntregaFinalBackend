import jwt from "jsonwebtoken";
import envs from "../config/env.config.js"

export const createToken = (user) => {
  const { _id, email, role, cart } = user;
  const token = jwt.sign({ _id, email, role, cart }, envs.CODE_SECRET, { expiresIn: "1m" });
  return token;
};

export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, envs.CODE_SECRET);
    return decode;
  } catch (error) {
    return null;
  }
};