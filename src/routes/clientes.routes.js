import { Router } from "express";
import { getClientes, getClientesId, postClientes } from "../controllers/clientes.controller.js";

const clientesRouter = Router()

clientesRouter.get('/customers', getClientes)
clientesRouter.post('/customers', postClientes)
clientesRouter.get('/customers/:id', getClientesId)

export default clientesRouter