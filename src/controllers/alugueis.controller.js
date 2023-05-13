import { db } from "../database/database.connection.js";

export async function getAlugueis(req, res){
    try{
        const alugueis = await db.query(`SELECT * FROM rentals`)
        res.send(alugueis.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

export async function postAlugueis(req, res){
    const { customerId, gameId, daysRented } = req.body

    try{
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "daysRented")
            VALUES ($1, $2, $3)
        `, [customerId, gameId, daysRented])

        res.status(201).send("Aluguel inserido!")
    } catch(err){
        res.status(500).send(err.message)
    }
}