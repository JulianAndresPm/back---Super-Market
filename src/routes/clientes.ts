import { Router } from "express";
import { getClientes, getCliente, postClientes, updateClientes } from "../controllers/clientes";
import upload from '../controllers/middelware.fotoCliente'

const router = Router();

router.get('/', getClientes);
router.get('/:id', getCliente);
router.post('/',upload,postClientes);
router.put('/:id',upload, updateClientes);

export default router;