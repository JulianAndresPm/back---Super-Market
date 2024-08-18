"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middelware_fotoUsuarios_1 = __importDefault(require("../controllers/middelware.fotoUsuarios"));
const middelware_jwt_1 = __importDefault(require("../controllers/middelware.jwt"));
const admins_1 = require("../controllers/admins");
const router = (0, express_1.Router)();
router.get('/', middelware_jwt_1.default, admins_1.getListUsuariosAdmin);
router.get('/:id', admins_1.getUsuarioAdmin);
// router.delete('/:id', deleteProducto);
router.post('/', middelware_fotoUsuarios_1.default, admins_1.postUsuarios);
router.put('/:id', middelware_fotoUsuarios_1.default, admins_1.updateUsuarioAdmin);
//ruta para validar el inicio de sesion
router.post('/login', admins_1.login);
exports.default = router;
