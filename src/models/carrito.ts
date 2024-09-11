import { DataTypes } from 'sequelize';
import db from '../db/conexion';
import producto from './producto';

const Carrito = db.define('carrito', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    tableName: 'carrito',
    timestamps: false
});
Carrito.belongsTo(producto, { foreignKey: 'producto_id', as: 'Producto' });

export default Carrito;
