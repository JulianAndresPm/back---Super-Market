import { Router } from "express";
import { deleteProducto, getProducto, getProductos, postProducto, updateProducto } from "../controllers/productos";
import jwt from '../controllers/middelware.jwt'
import upload from '../controllers/imagenProducto'

const router = Router();

router.get('/', getProductos);
router.get('/:id', jwt, getProducto);
router.delete('/:id', jwt, deleteProducto);
router.post('/', jwt, upload,postProducto);
router.put('/:id', jwt,upload, updateProducto);

export default router;