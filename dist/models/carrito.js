"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
const producto_1 = __importDefault(require("./producto"));
const Carrito = conexion_1.default.define('carrito', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    producto_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'carrito',
    timestamps: false
});
Carrito.belongsTo(producto_1.default, { foreignKey: 'producto_id', as: 'Producto' });
exports.default = Carrito;
