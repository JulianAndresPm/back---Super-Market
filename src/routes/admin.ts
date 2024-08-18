import { Router } from "express";
import upload from '../controllers/middelware.fotoUsuarios'
import jwt from '../controllers/middelware.jwt'
import { getListUsuariosAdmin, postUsuarios, login, getUsuarioAdmin, updateUsuarioAdmin} from "../controllers/admins";
import imagenProducto from "../controllers/imagenProducto";

const router = Router();

router.get('/',  jwt, getListUsuariosAdmin );
router.get('/:id', getUsuarioAdmin);
// router.delete('/:id', deleteProducto);
router.post('/',upload,postUsuarios);
router.put('/:id',upload, updateUsuarioAdmin);

//ruta para validar el inicio de sesion
router.post('/login',login);


export default router;
