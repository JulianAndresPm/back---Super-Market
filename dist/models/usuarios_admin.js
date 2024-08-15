"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conexion_1 = __importDefault(require("../db/conexion"));
const sequelize_1 = require("sequelize");
const usuariosAdmin = conexion_1.default.define('usuarios_admin', {
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    usuario: {
        type: sequelize_1.DataTypes.STRING
    },
    passw: {
        type: sequelize_1.DataTypes.STRING
    },
    rol: {
        type: sequelize_1.DataTypes.STRING
    },
    foto: {
        type: sequelize_1.DataTypes.STRING
    }
}, {
    createdAt: false,
    updatedAt: false
});
exports.default = usuariosAdmin;
