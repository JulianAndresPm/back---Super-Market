import { Router } from "express";
import {postFactura } from "../controllers/factura";

const router = Router();

router.post('/',postFactura);

export default router;