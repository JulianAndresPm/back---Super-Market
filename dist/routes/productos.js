"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productos_1 = require("../controllers/productos");
const imagenProducto_1 = __importDefault(require("../controllers/imagenProducto"));
const router = (0, express_1.Router)();
router.get('/', productos_1.getProductos);
router.get('/:id', productos_1.getProducto);
router.delete('/:id', productos_1.deleteProducto);
router.post('/', imagenProducto_1.default, productos_1.postProducto);
router.put('/:id', imagenProducto_1.default, productos_1.updateProducto);
exports.default = router;
