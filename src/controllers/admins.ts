import { Request, Response } from "express";
import usuarioAdmin from "../models/usuarios_admin";



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
