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
exports.deleteProductosCarrito = exports.deleteCarrito = exports.updateCarrito = exports.dataCarrito = exports.postCarrito = exports.getCarritoByUser = exports.getListaCarrito = void 0;
const producto_1 = __importDefault(require("../models/producto"));
const carrito_1 = __importDefault(require("../models/carrito"));
const server_1 = require("../models/server");
const getListaCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listaCarrito = yield carrito_1.default.findAll(); // Verifica aquí si obtienes resultados
        // console.log('Items del carrito:', listaCarrito); // Verificar en consola
        if (listaCarrito.length === 0) {
            res.status(404).json({ msg: 'No hay productos en el carrito' });
        }
        else {
            res.json(listaCarrito);
        }
    }
    catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({
            msg: 'Error al obtener los productos del carrito',
            error
        });
    }
});
exports.getListaCarrito = getListaCarrito;
const getCarritoByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //id del usuario en la session storage
    const { usuario_id } = req.params;
    // console.log('ID del usuario obtenido de la ruta:', usuario_id);
    try {
        const getProductos = yield carrito_1.default.findAll({
            where: { usuario_id },
            include: [{ model: producto_1.default, as: 'Producto' }]
        });
        if (!getProductos.length) {
            return res.status(200).json([]); // Devuelve un array vacío
        }
        else {
            res.json(getProductos);
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los productos del usuario',
            Error
        });
    }
});
exports.getCarritoByUser = getCarritoByUser;
/// /agregar los datos al carrito
const postCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario_id, producto_id, cantidad } = req.body;
    // Validación de entrada
    if (!usuario_id || !producto_id || !cantidad) {
        return res.status(400).json({ msg: 'Todos los campos son requeridos: id_usuario, id_producto, cantidad' });
    }
    try {
        // Obtener el precio del producto desde la base de datos 
        const Producto = yield producto_1.default.findByPk(producto_id); // Asegúrate de tener el modelo Producto definido
        if (!Producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        const precioProducto = Producto.get('precio');
        // Verifica si 'precioProducto' es válido y es un número
        const subtotal = precioProducto && typeof precioProducto === 'number' ? precioProducto * cantidad : 0;
        // Crear el carrito con los datos validados
        const nuevoCarrito = yield carrito_1.default.create({
            usuario_id,
            producto_id,
            cantidad,
            subtotal
        });
        //emitir un evento de websocket cuando se agrega un prodcuto al carrito
        server_1.io.emit('carritoActualizado', { usuario_id, carrito: nuevoCarrito });
        res.json({
            msg: 'Registro agregado exitosamente',
            data: nuevoCarrito // Puedes devolver el registro creado si es necesario
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
exports.postCarrito = postCarrito;
//traer los datos del carrito con id
const dataCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const dataCarrito = yield carrito_1.default.findByPk(id);
    if (dataCarrito) {
        res.json({
            id: dataCarrito.get('id'),
            cantidad: dataCarrito.get('cantidad')
        });
    }
    else {
        res.status(444).json({
            msg: 'No exite'
        });
    }
});
exports.dataCarrito = dataCarrito;
// Actualizar los datos del carrito
const updateCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del carrito que se va a actualizar
    // Campos a actualizar, extraídos del cuerpo de la solicitud
    const { cantidad } = req.body;
    try {
        // Buscar el carrito por ID
        const Carrito = yield carrito_1.default.findByPk(id);
        // Verificar si existe el registro del carrito
        if (Carrito) {
            // Buscar el id del producto en la tabla productos
            const productoId = Carrito.get('producto_id');
            const Producto = yield producto_1.default.findByPk(productoId); // Obtener el producto por su ID
            if (!Producto) {
                return res.status(404).json({
                    msg: 'No se encontró el producto asociado al carrito.'
                });
            }
            // Validar que la cantidad es un número positivo
            if (cantidad <= 0) {
                return res.status(400).json({
                    msg: 'La cantidad debe ser un número mayor que cero.'
                });
            }
            // Calcular el subtotal
            const subtotal = Producto.get('precio') * cantidad;
            // Actualizar los datos del carrito
            yield Carrito.update({
                cantidad,
                subtotal
            });
            res.json({
                msg: 'Actualizado exitosamente',
                // data: Carrito // Opcional: enviar los datos actualizados
            });
        }
        else {
            res.status(404).json({
                msg: 'Carrito no encontrado'
            });
        }
    }
    catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({
            msg: 'Hubo un error al actualizar el carrito.',
            error
        });
    }
});
exports.updateCarrito = updateCarrito;
const deleteCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const Carrito = yield carrito_1.default.findByPk(id);
    if (Carrito) {
        yield Carrito.destroy();
        // Emitir un evento de WebSocket cuando se elimina un producto
        //io.emit('carritoEliminado', { carritoId: id }); // Actualiza la lista del carrito
        res.json({
            msg: 'Producto del carrito eliminado con exito'
        });
    }
    else {
        res.status(444).json({
            msg: 'No fue posible eliminar este producto del carrito'
        });
    }
});
exports.deleteCarrito = deleteCarrito;
//Depues de finalizar la compra se ve recomdable que los productos
//que estan el carrito se elimine ya que se finalizo la compra
const deleteProductosCarrito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario_id } = req.params;
    try {
        // Verificamos si el usuario_id está definido
        if (!usuario_id) {
            return res.status(400).json({ message: 'ID de usuario no proporcionado o inválido' });
        }
        // Ejecutamos la eliminación de los productos del carrito
        const deletedCount = yield carrito_1.default.destroy({
            where: { usuario_id }
        });
        if (deletedCount > 0) {
            server_1.io.emit('carritoActualizado', { usuario_id, carrito: [] });
            return res.status(200).json({ message: 'Productos eliminados del carrito con éxito' });
        }
        else {
            return res.status(404).json({ message: 'No se encontraron productos en el carrito para este usuario' });
        }
    }
    catch (error) {
        console.error('Error al eliminar productos del carrito:', error);
        return res.status(500).json({ message: 'Error interno del servidor al intentar eliminar los productos del carrito' });
    }
});
exports.deleteProductosCarrito = deleteProductosCarrito;
