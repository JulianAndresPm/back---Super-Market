import { Router } from 'express';
import { 
    getListaCarrito, postCarrito, dataCarrito, updateCarrito, getCarritoByUser, deleteCarrito
} from '../controllers/carrito';

const router = Router();

// Ruta para obtener la lista de productos en el carrito
//lista todos los datos que hay en la tabla
router.get('/', getListaCarrito);
// lista los productos de un usuario en especifico
router.get('/productos/:usuario_id', getCarritoByUser);
//enviar los datos del producto a la tabla
router.post('/', postCarrito);
//trae los datos del producto, solo el campo cantidad
router.get('/:id', dataCarrito)
//envia los datos actualizados
router.put('/:id', updateCarrito)
//eliminar un producto
router.delete('/:id', deleteCarrito)




export default router;
