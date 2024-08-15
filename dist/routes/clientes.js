"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clientes_1 = require("../controllers/clientes");
const fotoCliente_1 = __importDefault(require("../controllers/fotoCliente"));
const router = (0, express_1.Router)();
router.get('/', clientes_1.getClientes);
router.get('/:id', clientes_1.getCliente);
router.post('/', fotoCliente_1.default, clientes_1.postClientes);
router.put('/:id', fotoCliente_1.default, clientes_1.updateClientes);
exports.default = router;
