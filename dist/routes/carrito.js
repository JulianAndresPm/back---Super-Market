"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrito_1 = require("../controllers/carrito");
const router = (0, express_1.Router)();
// Ruta para obtener la lista de productos en el carrito
//lista todos los datos que hay en la tabla
router.get('/', carrito_1.getListaCarrito);
// lista los productos de un usuario en especifico
router.get('/productos/:usuario_id', carrito_1.getCarritoByUser);
//enviar los datos del producto a la tabla
router.post('/', carrito_1.postCarrito);
//trae los datos del producto, solo el campo cantidad
router.get('/:id', carrito_1.dataCarrito);
//envia los datos actualizados
router.put('/:id', carrito_1.updateCarrito);
//eliminar un producto
router.delete('/:id', carrito_1.deleteCarrito);
exports.default = router;
