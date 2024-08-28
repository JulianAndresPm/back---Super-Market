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
exports.updateUsuarioAdmin = exports.getUsuarioAdmin = exports.postUsuarios = exports.getListUsuariosAdmin = void 0;
const usuarios_admin_1 = __importDefault(require("../models/usuarios_admin"));
const getListUsuariosAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listaUsuarios = yield usuarios_admin_1.default.findAll();
        res.json(listaUsuarios);
    }
    catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ msg: 'Error al obtener los usuarios' });
    }
});
exports.getListUsuariosAdmin = getListUsuariosAdmin;
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
//obtener datos del usuario
const getUsuarioAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const usuario = yield usuarios_admin_1.default.findByPk(id);
    if (usuario) {
        res.json(usuario);
    }
    else {
        res.status(444).json({
            msg: 'No exite el usuario'
        });
    }
});
exports.getUsuarioAdmin = getUsuarioAdmin;
//actualizara los datos del usuario
const updateUsuarioAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    //  los archivos estarán en req.file o req.files
    const foto = req.file;
    // El resto de los campos estarán en req.body
    const { nombre, usuario, passw, rol } = req.body;
    // console.log('ID:', id);
    // console.log('File:', foto);
    // console.log('Body:', req.body);
    try {
        const usuario = yield usuarios_admin_1.default.findByPk(id);
        if (usuario) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (foto) {
                yield usuario.update(Object.assign(Object.assign({}, req.body), { foto: foto.filename // Asegúrate de guardar la ruta correcta
                 }));
            }
            else {
                yield usuario.update(req.body);
            }
            res.json({
                msg: 'usuario actualizado exitosamente'
            });
        }
        else {
            res.status(404).json({
                msg: 'usuario no encontrado'
            });
        }
    }
    catch (error) {
        console.error('Error al actualizar los datos:', error);
        res.status(500).json({
            msg: 'Error al actualizar los datos'
        });
    }
});
exports.updateUsuarioAdmin = updateUsuarioAdmin;
