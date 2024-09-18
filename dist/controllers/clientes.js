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
exports.getClientes = exports.updateClientes = exports.getCliente = exports.postClientes = void 0;
const clientes_1 = __importDefault(require("../models/clientes"));
//Agregar Clientes
const postClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    console.log(body);
    const foto = req.file ? req.file.filename : null;
    try {
        // Crea el usuario con los datos del cuerpo y la imagen si está disponible
        yield clientes_1.default.create(Object.assign(Object.assign({}, body), { foto: foto // Guarda el nombre del archivo en la base de datos
         }));
        res.json({
            msg: 'Registro agregado exitosamente'
        });
    }
    catch (error) {
        console.error('Error al agregar:', error); // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar los datos',
            error
        });
    }
});
exports.postClientes = postClientes;
//editar, traer los datos del cliente
const getCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cliente = yield clientes_1.default.findByPk(id);
    if (cliente) {
        res.json(cliente);
    }
    else {
        res.status(444).json({
            msg: 'No exite el producto'
        });
    }
});
exports.getCliente = getCliente;
//actualizar los datos del clientes
const updateClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Si estás usando multer, los archivos estarán en req.file o req.files
    const foto = req.file;
    // El resto de los campos estarán en req.body
    const { nombre, apellidos, edad, sexo, correo, contraseña } = req.body;
    try {
        const cliente = yield clientes_1.default.findByPk(id);
        if (cliente) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (foto) {
                yield cliente.update(Object.assign(Object.assign({}, req.body), { foto: foto.filename // Asegúrate de guardar la ruta correcta
                 }));
            }
            else {
                yield cliente.update(req.body);
            }
            // Obtén los datos actualizados del cliente
            // const clienteActualizado = await clientes.findByPk(id);
            yield cliente.reload();
            //enviar nuevamente los datos actualizados
            res.json(cliente);
        }
        else {
            res.status(404).json({
                msg: 'Datos no encontrado'
            });
        }
    }
    catch (error) {
        console.error('Error al actualizar los Datos:', error);
        res.status(500).json({
            msg: 'Error al actualizar los Datos'
        });
    }
});
exports.updateClientes = updateClientes;
//listar los clientes registados
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listaClientes = yield clientes_1.default.findAll();
    res.json(listaClientes);
});
exports.getClientes = getClientes;
