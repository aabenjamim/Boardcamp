import { Router } from "express";
import { getClientes, postClientes } from "../controllers/clientes.controller.js";

const clientesRouter = Router()

clientesRouter.get('/customers', getClientes)
clientesRouter.post('/customers', postClientes)

export default clientesRouter