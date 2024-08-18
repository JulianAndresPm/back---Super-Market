import db from '../db/conexion'
import {DataTypes } from 'sequelize'


const clientes = db.define('usuarios_clientes',{
    nombres:{
        type: DataTypes.STRING
    },
    apellidos:{
        type: DataTypes.STRING
    },
    edad:{
        type: DataTypes.INTEGER
    },
    sexo:{
        type: DataTypes.STRING
    },
    correo:{
        type: DataTypes.STRING
    },
    usuario:{
        type: DataTypes.STRING
    },
    contrasena:{
        type: DataTypes.STRING
    },
    foto:{
        type: DataTypes.STRING
    }
},{
    createdAt: false,
    updatedAt: false
});




export default clientes;