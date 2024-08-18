import { Request, Response } from "express";
import usuarioAdmin from "../models/usuarios_admin";
import jwt from 'jsonwebtoken'



export const getListUsuariosAdmin = async (req: Request, res: Response) => {
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


//validar el incio de sesion - login
export const login = async (req: Request, res: Response) => {
        const KEY = process.env.JWT_KEY
        console.log(KEY);
        
        const { usuario, passw } = req.body;

        try {
            // Buscar al usuario en la tabla de administradores
            const admin = await usuarioAdmin.findOne({ where: { usuario, passw } });
    
            if (!admin) {
                // Si no se encuentra el usuario, enviar una respuesta de error
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            try {
                const accesstoken = jwt.sign({ usuario, passw }, KEY, { expiresIn: '5m' });
                res.status(200).json({ message: 'Login successful', admin, accesstoken });
                
            } catch (error) {
                console.log('JWT sign error:', error);
                return res.status(500).json({ message: 'Token generation failed' });
            }
            // const token = jwt.sign({ id: admin.id, usuario: admin.usuario }, KEY, { expiresIn: '1h' });

            
        } catch (error) {
            // Manejo de errores del servidor
            console.log(error);
            
            res.status(500).json({ message: 'Server error' });
        }
    
 };
 
 //obtener datos del usuario
 export const getUsuarioAdmin = async(req: Request, res: Response) =>{
    const { id } = req.params;
    const usuario = await usuarioAdmin.findByPk(id)

    if(usuario){
        res.json(usuario) 
    }else{
        res.status(444).json({
            msg: 'No exite el usuario'
        })
    }
}

//actualizara los datos del usuario
export const updateUsuarioAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;

    //  los archivos estarán en req.file o req.files
    const foto = req.file;

    // El resto de los campos estarán en req.body
    const { nombre, usuario, passw, rol} = req.body;

    // console.log('ID:', id);
    // console.log('File:', foto);
    // console.log('Body:', req.body);

    try {
        const usuario = await usuarioAdmin.findByPk(id);
        
        if (usuario) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (foto) {
                await usuario.update({
                    ...req.body,
                    foto: foto.filename // Asegúrate de guardar la ruta correcta
                });
            } else {
                await usuario.update(req.body);
            }
            
            res.json({
                msg: 'usuario actualizado exitosamente'
            });
        } else {
            res.status(404).json({
                msg: 'usuario no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar los datos:', error);
        res.status(500).json({
            msg: 'Error al actualizar los datos'
        });
    }
}
