import { Router } from "express";
import upload from '../controllers/middelware.fotoUsuarios'
import jwt from '../controllers/middelware.jwt'
import { getListUsuariosAdmin, postUsuarios, getUsuarioAdmin, updateUsuarioAdmin} from "../controllers/admins";

const router = Router();

router.get('/',  jwt, getListUsuariosAdmin );
router.get('/:id', getUsuarioAdmin);
// router.delete('/:id', deleteProducto);
router.post('/',upload,postUsuarios);
router.put('/:id',upload, updateUsuarioAdmin);

export default router;
