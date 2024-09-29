"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const usuarios_admin_1 = __importDefault(require("../models/usuarios_admin"));
const clientes_1 = __importDefault(require("../models/clientes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Validar el inicio de sesión - login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const KEY = process.env.JWT_KEY;
    const { usuario, passw } = req.body;
    try {
        // Buscar al usuario en la tabla de administradores
        const admin = yield usuarios_admin_1.default.findOne({ where: { usuario, passw } });
        if (admin) {
            // Usuario encontrado en admin
            const accesstoken = jsonwebtoken_1.default.sign({ usuario: admin.get('usuario'), rol: admin.get('rol'), info: admin }, KEY, { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Login successful admin',
                accesstoken,
                UserType: admin.get('rol'),
                admin
            });
        }
        // Si no se encuentra en administradores, buscar en clientes
        const cliente = yield clientes_1.default.findOne({ where: { usuario, contrasena: passw } });
        if (cliente) {
            // Usuario encontrado en cliente
            const accesstoken = jsonwebtoken_1.default.sign({ usuario: cliente.get('id'), rol: 'cliente', info: cliente }, KEY, { expiresIn: '1h' });
            return res.status(200).json({
                message: 'Login successful cliente',
                accesstoken,
                UserType: 'cliente',
                cliente
            });
        }
        // Si no se encuentra el usuario en ninguna tabla
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.login = login;
