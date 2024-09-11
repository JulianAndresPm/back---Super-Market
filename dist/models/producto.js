"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conexion_1 = __importDefault(require("../db/conexion"));
const sequelize_1 = require("sequelize");
const producto = conexion_1.default.define('producto', {
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING
    },
    precio: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    stock: {
        type: sequelize_1.DataTypes.INTEGER
    },
    imagen: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    createdAt: false,
    updatedAt: false
});
// Configura la asociación hasMany entre Producto y Carrito
// producto.hasMany(Carrito, { foreignKey: 'producto_id', as: 'Carritos' });
exports.default = producto;
