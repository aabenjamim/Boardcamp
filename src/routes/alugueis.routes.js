import { Router } from "express";
import { getAlugueis, postAlugueis } from "../controllers/alugueis.controller.js";
import { validate } from "../middlewares/validateSchema.middleware.js";
import { aluguelSchema } from "../schemas/alugueis.schema.js";

const alugueisRouter = Router()

alugueisRouter.get('/rentals', getAlugueis)
alugueisRouter.post('/rentals', validate(aluguelSchema, 400), postAlugueis)


export default alugueisRouter