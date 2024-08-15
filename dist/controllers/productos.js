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
exports.updateProducto = exports.postProducto = exports.deleteProducto = exports.getProducto = exports.getProductos = void 0;
const producto_1 = __importDefault(require("../models/producto"));
//listar productos
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listaProductos = yield producto_1.default.findAll();
    res.json(listaProductos);
});
exports.getProductos = getProductos;
//edita productos
const getProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productos = yield producto_1.default.findByPk(id);
    if (productos) {
        res.json(productos);
    }
    else {
        res.status(444).json({
            msg: 'No exite el producto'
        });
    }
});
exports.getProducto = getProducto;
//eliminar productos
const deleteProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const productos = yield producto_1.default.findByPk(id);
    if (productos) {
        yield productos.destroy();
        res.json({
            msg: 'Producto eliminado exitosamente'
        });
    }
    else {
        res.status(444).json({
            msg: 'No fue posible o no existe'
        });
    }
});
exports.deleteProducto = deleteProducto;
//enviar o agregar producto
const postProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const imagen = req.file ? req.file.filename : null; // Captura el nombre del archivo subido
    try {
        // Crea el producto con los datos del cuerpo y la imagen si está disponible
        yield producto_1.default.create(Object.assign(Object.assign({}, body), { imagen: imagen // Guarda el nombre del archivo en la base de datos
         }));
        res.json({
            msg: 'Producto agregado exitosamente'
        });
    }
    catch (error) {
        console.error(error); // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar este producto',
            error
        });
    }
});
exports.postProducto = postProducto;
//actualizara los datos del productos
const updateProducto = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Si estás usando multer, los archivos estarán en req.file o req.files
    const imagen = req.file;
    // El resto de los campos estarán en req.body
    const { nombre, descripcion, precio, stock } = req.body;
    // console.log('ID:', id);
    // console.log('File:', imagen);
    // console.log('Body:', req.body);
    try {
        const productos = yield producto_1.default.findByPk(id);
        if (productos) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (imagen) {
                yield productos.update(Object.assign(Object.assign({}, req.body), { imagen: imagen.filename // Asegúrate de guardar la ruta correcta
                 }));
            }
            else {
                yield productos.update(req.body);
            }
            res.json({
                msg: 'Producto actualizado exitosamente'
            });
        }
        else {
            res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
    }
    catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            msg: 'Error al actualizar producto'
        });
    }
});
exports.updateProducto = updateProducto;
