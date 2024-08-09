import db from '../db/conexion'
import {DataTypes } from 'sequelize'


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




export default producto;