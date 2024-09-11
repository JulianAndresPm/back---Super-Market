"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = exports.Producto = void 0;
const carrito_1 = __importDefault(require("./carrito"));
exports.Carrito = carrito_1.default;
const producto_1 = __importDefault(require("./producto"));
exports.Producto = producto_1.default;
// Define asociaciones
carrito_1.default.belongsTo(producto_1.default, { foreignKey: 'producto_id', as: 'Producto' });
producto_1.default.hasMany(carrito_1.default, { foreignKey: 'producto_id' });
