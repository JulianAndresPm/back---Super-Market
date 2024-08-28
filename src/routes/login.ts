import { Router } from "express";
import { login } from "../controllers/login";

const router = Router();

//ruta para validar el inicio de sesion
router.post('/',login);

export default router;
