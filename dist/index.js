"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server")); // Asegúrate de que esta ruta sea correcta
// Configuración de las variables de entorno
dotenv_1.default.config();
// Usar la instancia directamente, sin 'new'
server_1.default.listen();
