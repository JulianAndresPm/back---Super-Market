import { Request, Response } from "express";
import producto from "../models/producto";


//listar productos
export const getProductos   = async(req: Request, res: Response) =>{
    const listaProductos = await producto.findAll()
    res.json(listaProductos)
}

//edita productos
export const getProducto = async(req: Request, res: Response) =>{
    const { id } = req.params;
    const productos = await producto.findByPk(id)

    if(productos){
        res.json(productos) 
    }else{
        res.status(444).json({
            msg: 'No exite el producto'
        })
    }
}

//eliminar productos

export const deleteProducto = async(req: Request, res: Response) =>{
    const { id } = req.params;
    const productos = await producto.findByPk(id)
    if(productos){
        await productos.destroy();
        res.json({
            msg: 'Producto eliminado exitosamente'
        })
    }else{
        res.status(444).json({
            msg: 'No fue posible o no existe'
        })
    }
}

//enviar o agregar producto

export const postProducto = async (req: Request, res: Response) => {
    const { body } = req;
    const imagen = req.file ? req.file.filename : null; // Captura el nombre del archivo subido
  
    try {
      // Crea el producto con los datos del cuerpo y la imagen si está disponible
      await producto.create({
        ...body,
        imagen: imagen // Guarda el nombre del archivo en la base de datos
      });
  
      res.json({
        msg: 'Producto agregado exitosamente'
      });
    } catch (error) {
      console.error(error); // Imprime el error en la consola para depuración
      res.status(500).json({
        msg: 'No fue posible agregar este producto',
        error
      });
    }
  };

//actualizara los datos del productos
export const updateProducto = async (req: Request, res: Response) => {
    const { id } = req.params;

    // Si estás usando multer, los archivos estarán en req.file o req.files
    const imagen = req.file;

    // El resto de los campos estarán en req.body
    const { nombre, descripcion, precio, stock} = req.body;

    // console.log('ID:', id);
    // console.log('File:', imagen);
    // console.log('Body:', req.body);

    try {
        const productos = await producto.findByPk(id);
        
        if (productos) {
            // Si tienes un archivo, puedes actualizar la ruta de la imagen también
            if (imagen) {
                await productos.update({
                    ...req.body,
                    imagen: imagen.filename // Asegúrate de guardar la ruta correcta
                });
            } else {
                await productos.update(req.body);
            }
            
            res.json({
                msg: 'Producto actualizado exitosamente'
            });
        } else {
            res.status(404).json({
                msg: 'Producto no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            msg: 'Error al actualizar producto'
        });
    }
}

    


