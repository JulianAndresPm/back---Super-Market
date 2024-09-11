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
exports.deleteCarrito = exports.updateCarrito = exports.dataCarrito = exports.postCarrito = exports.getCarritoByUser = exports.getListaCarrito = void 0;
const carrito_1 = __importDefault(require("../models/carrito"));
const producto_1 = __importDefault(require("../models/producto"));
const carrito_2 = __importDefault(require("../models/carrito"));
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
    console.log('ID del usuario obtenido de la ruta:', usuario_id);
    try {
        const getProductos = yield carrito_1.default.findAll({
            where: { usuario_id },
            include: [{ model: producto_1.default, as: 'Producto' }]
        });
        if (!getProductos.length) {
            return res.status(400).json({
                msg: 'no se encontraron productos para este usuario'
            });
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
    const carrito = yield carrito_2.default.findByPk(id);
    if (carrito) {
        yield carrito.destroy();
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
