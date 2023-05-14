import joi from 'joi'

export const clienteSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required().pattern(/^\d+$/),
    cpf: joi.string().length(11).pattern(/^\d+$/).required(),
    birthday: joi.date().iso().required()
})