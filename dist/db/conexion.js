"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// Option 3: Passing parameters separately (other dialects)
// Crear una instancia de Sequelize
const sequelize = new sequelize_1.Sequelize('superMarket', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});
exports.default = sequelize;
