import { Router } from "express";
import { getAlugueis, postAlugueis } from "../controllers/alugueis.controller.js";

const alugueisRouter = Router()

alugueisRouter.get('/rentals', getAlugueis)
alugueisRouter.post('/rentals', postAlugueis)

export default alugueisRouter