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
exports.postUsuarios = exports.getUsuariosAdmin = void 0;
const usuarios_admin_1 = __importDefault(require("../models/usuarios_admin"));
const getUsuariosAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listaUsuarios = yield usuarios_admin_1.default.findAll();
        res.json(listaUsuarios);
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ msg: 'Error al obtener los usuarios' });
    }
});
exports.getUsuariosAdmin = getUsuariosAdmin;
//enviar o agregar producto
const postUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const imagen = req.file ? req.file.filename : null; // Captura el nombre del archivo subido
    try {
        // Crea el usuario con los datos del cuerpo y la imagen si está disponible
        yield usuarios_admin_1.default.create(Object.assign(Object.assign({}, body), { foto: imagen // Guarda el nombre del archivo en la base de datos
         }));
        res.json({
            msg: 'Usuario agregado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al agregar el usuario:', error); // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar el usuario',
            error
        });
    }
});
exports.postUsuarios = postUsuarios;
