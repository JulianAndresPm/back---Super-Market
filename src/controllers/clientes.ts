import { Request, Response } from "express";
import clientes from "../models/clientes";

//Agregar Clientes
export const postClientes = async (req: Request, res: Response) =>{
    const { body } = req;
    const foto = req.file ? req.file.filename : null

    try {
        // Crea el usuario con los datos del cuerpo y la imagen si está disponible
        await clientes.create({
            ...body,
            foto: foto // Guarda el nombre del archivo en la base de datos
        });
  
        res.json({
            msg: 'Registro agregado exitosamente'
        });
    } catch (error) {
        console.error('Error al agregar:', error); // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar los datos',
            error
        });
    }
}

//editar, traer los datos del cliente
export const getCliente = async(req: Request, res: Response) =>{
    const { id } = req.params;
    const cliente = await clientes.findByPk(id)

    if(cliente){
        res.json(cliente) 
    }else{
        res.status(444).json({
            msg: 'No exite el producto'
        })
    }
}

//actualizar los datos del clientes
export const updateClientes = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Si estás usando multer, los archivos estarán en req.file o req.files
    const foto = req.file;

    // El resto de los campos estarán en req.body
    const { nombre, apellidos, edad, sexo, correo, passw} = req.body;

    // console.log('ID:', id);
    // console.log('File:', imagen);
    // console.log('Body:', req.body);

    try {
        const cliente = await clientes.findByPk(id);
        
        if (cliente) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (foto) {
                await cliente.update({
                    ...req.body,
                    foto: foto.filename // Asegúrate de guardar la ruta correcta
                });
            } else {
                await cliente.update(req.body);
            }
            
            res.json({
                msg: 'Datos actualizado exitosamente'
            });
        } else {
            res.status(404).json({
                msg: 'Datos no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar los Datos:', error);
        res.status(500).json({
            msg: 'Error al actualizar los Datos'
        });
    }
}

//listar los clientes registados
export const getClientes = async(req: Request, res: Response) =>{
    const listaClientes = await clientes.findAll()
    res.json(listaClientes)
}
