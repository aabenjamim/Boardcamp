import { Router } from "express";
import { getClientes, getClientesId, postClientes, putClientes } from "../controllers/clientes.controller.js";
import { validate } from "../middlewares/validateSchema.middleware.js";
import { clienteSchema } from "../schemas/clientes.schema.js";

const clientesRouter = Router()

clientesRouter.get('/customers', getClientes)
clientesRouter.post('/customers', validate(clienteSchema, 400), postClientes)
clientesRouter.get('/customers/:id', getClientesId)
clientesRouter.put('/customers/:id', validate(clienteSchema, 400) ,putClientes)

export default clientesRouter