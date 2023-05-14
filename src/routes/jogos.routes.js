import { Router } from "express"
import { getJogos, postJogos } from "../controllers/jogos.controller.js"
import { validate } from "../middlewares/validateSchema.middleware.js"
import { jogoSchema } from "../schemas/jogos.schema.js"

const jogosRouter = Router()

jogosRouter.get('/games', getJogos)
jogosRouter.post('/games', validate(jogoSchema, 400), postJogos)

export default jogosRouter