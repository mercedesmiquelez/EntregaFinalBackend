import mongoose from "mongoose"; // Importamos el modulo de mongoose
import envs from "./env.config.js";
import { logger } from "../utils/logger.js";

export const connectMongoDB = async () => {
  //Se usa el try catch para capturar el error en caso que se encuentre uno
  try {
    // Conexión con la base de datos
    mongoose.connect(envs.MONGO_URL);
    logger.info("Mongo DB Conectado");
  } catch (error) {
    console.log(error);
  }
};