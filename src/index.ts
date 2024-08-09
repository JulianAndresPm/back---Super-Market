import Server from "./models/server";
import dotenv from 'dotenv'

//configuracion de las variables de entorno
dotenv.config();

const server = new Server();
