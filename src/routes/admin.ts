import { Router } from "express";
import upload from '../controllers/fotoUsuario'
import { getUsuariosAdmin, postUsuarios } from "../controllers/login";

const router = Router();

router.get('/', getUsuariosAdmin );
// router.get('/:id', getProducto);
// router.delete('/:id', deleteProducto);
router.post('/',upload,postUsuarios);
// router.put('/:id',upload, updateProducto);

export default router;
