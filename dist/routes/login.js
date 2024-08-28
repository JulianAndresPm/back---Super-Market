"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/login");
const router = (0, express_1.Router)();
//ruta para validar el inicio de sesion
router.post('/', login_1.login);
exports.default = router;
