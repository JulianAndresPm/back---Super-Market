import { Request, Response } from "express";
import carrito from "../models/carrito"; 
import producto from "../models/producto";
import Carrito from "../models/carrito"
import { io } from '../models/server'; 



export const getListaCarrito = async (req: Request, res: Response) => {
    try {
        const listaCarrito = await carrito.findAll(); // Verifica aquí si obtienes resultados
        // console.log('Items del carrito:', listaCarrito); // Verificar en consola
        
        if (listaCarrito.length === 0) {
            res.status(404).json({ msg: 'No hay productos en el carrito' });
        } else {
            res.json(listaCarrito);
        }
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({
            msg: 'Error al obtener los productos del carrito',
            error
        });
    }
};


export const getCarritoByUser = async(req: Request, res:Response)=>{

    //id del usuario en la session storage
    const {usuario_id} = req.params;

    // console.log('ID del usuario obtenido de la ruta:', usuario_id);

    try {
        const getProductos = await carrito.findAll({
            where: {usuario_id},
            include: [{model: producto, as: 'Producto'}]
        });

        if (!getProductos.length) {
            return res.status(400).json({
                msg: 'no se encontraron productos para este usuario'
            })
        } else {
            res.json(getProductos);   
        }

    } catch (error) {
        res.status(500).json({
            msg: 'Error al obtener los productos del usuario',
            Error
        });
        
    }
}


/// /agregar los datos al carrito
export const postCarrito = async (req: Request, res: Response) => {
    const { usuario_id, producto_id, cantidad } = req.body;

    // Validación de entrada
    if (!usuario_id || !producto_id || !cantidad) {
        return res.status(400).json({ msg: 'Todos los campos son requeridos: id_usuario, id_producto, cantidad' });
    }

    try {
        // Obtener el precio del producto desde la base de datos 
        const Producto = await producto.findByPk(producto_id);  // Asegúrate de tener el modelo Producto definido

        if (!Producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        const precioProducto = Producto.get('precio');

        // Verifica si 'precioProducto' es válido y es un número
        const subtotal = precioProducto && typeof precioProducto === 'number' ? precioProducto * cantidad : 0;

        // Crear el carrito con los datos validados
        const nuevoCarrito = await carrito.create({
            usuario_id,
            producto_id,
            cantidad,
            subtotal
        });

        //emitir un evento de websocket cuando se agrega un prodcuto al carrito
        io.emit('carritoActualizado',{usuario_id, carrito: nuevoCarrito})
        res.json({
            msg: 'Registro agregado exitosamente',
            data: nuevoCarrito  // Puedes devolver el registro creado si es necesario
        });
    } catch (error) {
        console.error('Error al agregar:', error);  // Imprime el error en la consola para depuración
        res.status(500).json({
            msg: 'No fue posible agregar los datos',
            error
        });
    }
};

//traer los datos del carrito con id
export const dataCarrito = async(req: Request, res: Response) =>{
    const { id } = req.params;
    const dataCarrito = await carrito.findByPk(id)

    if(dataCarrito){
        res.json({
            id: dataCarrito.get('id'),
            cantidad: dataCarrito.get('cantidad')
        })
    }else{
        res.status(444).json({
            msg: 'No exite'
        })
    }
}

// Actualizar los datos del carrito
export const updateCarrito = async (req: Request, res: Response) => {
    const { id } = req.params; // ID del carrito que se va a actualizar

    // Campos a actualizar, extraídos del cuerpo de la solicitud
    const { cantidad } = req.body;

    try {
        // Buscar el carrito por ID
        const Carrito = await carrito.findByPk(id); 
    
        // Verificar si existe el registro del carrito
        if (Carrito) {
            // Buscar el id del producto en la tabla productos
            const productoId = Carrito.get('producto_id') as number;
            const Producto = await producto.findByPk(productoId); // Obtener el producto por su ID
    
            if (!Producto) {
                return res.status(404).json({
                    msg: 'No se encontró el producto asociado al carrito.'
                });
            }
            // Validar que la cantidad es un número positivo
            if (cantidad <= 0) {
                return res.status(400).json({
                    msg: 'La cantidad debe ser un número mayor que cero.'
                });
            }
    
            // Calcular el subtotal
            const subtotal = Producto.get('precio') as number * cantidad;
    
            // Actualizar los datos del carrito
            await Carrito.update({
                cantidad,
                subtotal
            });
    
            res.json({
                msg: 'Actualizado exitosamente',
                // data: Carrito // Opcional: enviar los datos actualizados
            });
        } else {
            res.status(404).json({
                msg: 'Carrito no encontrado'
            });
        }
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({
            msg: 'Hubo un error al actualizar el carrito.',
            error
        });
    }
    
};

export const deleteCarrito = async(req: Request, res: Response) =>{
    const {id} = req.params;
    const carrito = await Carrito.findByPk(id);

    if (carrito) {
        await carrito.destroy();
        // Emitir un evento de WebSocket cuando se elimina un producto
        io.emit('carritoEliminado', { carritoId: id }); // Actualiza la lista del carrito
        res.json({
            msg: 'Producto del carrito eliminado con exito'
        })
    } else {
        res.status(444).json({
            msg: 'No fue posible eliminar este producto del carrito'
        })
    }
}
