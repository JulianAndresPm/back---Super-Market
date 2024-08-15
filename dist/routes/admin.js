"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fotoUsuario_1 = __importDefault(require("../controllers/fotoUsuario"));
const admins_1 = require("../controllers/admins");
const router = (0, express_1.Router)();
router.get('/', admins_1.getUsuariosAdmin);
// router.get('/:id', getProducto);
// router.delete('/:id', deleteProducto);
router.post('/', fotoUsuario_1.default, admins_1.postUsuarios);
// router.put('/:id',upload, updateProducto);
exports.default = router;
