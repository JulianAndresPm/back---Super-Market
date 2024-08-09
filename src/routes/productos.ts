import { Router } from "express";
import { deleteProducto, getProducto, getProductos, postProducto, updateProducto } from "../controllers/productos";
import upload from '../controllers/imagenes'

const router = Router();

router.get('/', getProductos);
router.get('/:id', getProducto);
router.delete('/:id', deleteProducto);
router.post('/',upload,postProducto);
router.put('/:id', updateProducto);

export default router;