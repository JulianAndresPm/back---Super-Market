"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const factura_1 = require("../controllers/factura");
const router = (0, express_1.Router)();
router.post('/', factura_1.postFactura);
exports.default = router;
