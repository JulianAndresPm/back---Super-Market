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
export const updateProducto = async (req: Request, res: Response) =>{
    const { id } = req.params;
    const { body } = req;
    const productos = await producto.findByPk(id)
    
    if(productos){
        await productos.update(body);
        res.json({
            msg: 'Producto actualizaso exitosamente'
        })
    }else{
        res.status(444).json({
            msg: 'No fue posible actualizar'
        })
    }
    
}

