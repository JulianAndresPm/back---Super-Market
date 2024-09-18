"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conexion_1 = __importDefault(require("../db/conexion"));
const Factura = conexion_1.default.define('facturas', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    valor_total: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    pdf: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    fecha_compra: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'facturas', // Asegúrate de que el nombre de la tabla sea correcto
    timestamps: false // Indica si deseas que Sequelize maneje createdAt y updatedAt
});
exports.default = Factura;
