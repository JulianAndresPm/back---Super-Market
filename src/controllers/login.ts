import { Request, Response } from "express";
import usuarioAdmin from "../models/usuarios_admin";

export const getUsuariosAdmin = async (req: Request, res: Response) => {
    try {
        const listaUsuarios = await usuarioAdmin.findAll();
        res.json(listaUsuarios);
        
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ msg: 'Error al obtener los usuarios' });
    }
};


//enviar o agregar producto

export const postUsuarios = async (req: Request, res: Response) => {
    const { body } = req;
    const imagen = req.file ? req.file.filename : null; // Captura el nombre del archivo subido
  
    try {
        // Crea el usuario con los datos del cuerpo y la imagen si está disponible
        await usuarioAdmin.create({
            ...body,
            foto: imagen // Guarda el nombre del archivo en la base de datos
        });
  
        res.json({
            msg: 'Usuario agregado exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar el usuario:', error); // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar el usuario',
            error
        });
    }
};