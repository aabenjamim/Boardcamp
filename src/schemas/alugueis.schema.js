import joi from 'joi'
import dayjs from 'dayjs'

export const aluguelSchema = joi.object({
    daysRented: joi.number().min(1).required()
})

