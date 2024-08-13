import db from '../db/conexion'
import {DataTypes } from 'sequelize'


const usuariosAdmin = db.define('usuarios_admin',{
    nombre:{
        type: DataTypes.STRING
    },
    usuario:{
        type: DataTypes.STRING
    },
    passw:{
        type: DataTypes.STRING
    },
    rol:{
        type: DataTypes.STRING
    },
    foto:{
        type: DataTypes.STRING
    }
},{
    createdAt: false,
    updatedAt: false
});




export default usuariosAdmin;