import { DataTypes } from 'sequelize';
import db from '../db/conexion';

const Factura = db.define('facturas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    valor_total: {
        type: DataTypes.FLOAT, 
        allowNull: false
    },
    pdf: {
        type: DataTypes.STRING, 
        allowNull: true
    },
    fecha_compra: {
        type: DataTypes.DATE, 
        allowNull: false
    }
}, {
    tableName: 'facturas', // Asegúrate de que el nombre de la tabla sea correcto
    timestamps: false // Indica si deseas que Sequelize maneje createdAt y updatedAt
});

export default Factura;
