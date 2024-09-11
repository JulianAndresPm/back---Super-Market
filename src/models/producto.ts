import db from '../db/conexion'
import {DataTypes } from 'sequelize'
import Carrito from './carrito';


const producto = db.define('producto',{
    nombre:{
        type: DataTypes.STRING
    },
    descripcion:{
        type: DataTypes.STRING
    },
    precio:{
        type: DataTypes.DOUBLE
    },
    stock:{
        type: DataTypes.INTEGER
    },
    imagen:{
        type: DataTypes.STRING
    }
},{
    createdAt: false,
    updatedAt: false
});

// Configura la asociación hasMany entre Producto y Carrito
// producto.hasMany(Carrito, { foreignKey: 'producto_id', as: 'Carritos' });

export default producto;