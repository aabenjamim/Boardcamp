import { Router } from "express"
import { getJogos, postJogos } from "../controllers/jogos.controller.js"

const jogosRouter = Router()

jogosRouter.get('/games', getJogos)
jogosRouter.post('/games', postJogos)

export default jogosRouter