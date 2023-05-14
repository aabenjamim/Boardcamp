import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

//listar alugueis
export async function getAlugueis(req, res){
    try{
        const alugueis = await db.query(`SELECT * FROM rentals`)
        res.send(alugueis.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

//inserir alugueis
export async function postAlugueis(req, res){
   const { customerId, gameId, daysRented } = req.body

    try{
        const cliente = await db.query(`SELECT * FROM customers WHERE id=$1;`,
        [customerId])
        if(cliente.rows.length === 0){
            return res.status(400).send("Cliente não encontrado!")
        }

        const jogo = await db.query(`SELECT * FROM games WHERE id=$1`,
        [gameId])
        if(jogo.rows.length === 0){
            return res.status(400).send("Jogo não encontrado!")
        }

        const alugueisEmAberto = await db.query(`
        SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId])

        const jogosDisponiveis = jogo.rows[0].stockTotal
        if(alugueisEmAberto.rowCount >= jogosDisponiveis){
            return res.status(400).send('Não há jogos disponíveis para aluguel no momento.')
        }
        
        const valor = await db.query(`
        SELECT "pricePerDay" FROM games WHERE id=$1`, [gameId])

        const valorFormatado = valor.rows[0].pricePerDay
        const originalPrice = valorFormatado*daysRented
        const rentDate = dayjs().format('YYYY-MM-DD')
        
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "returnDate", 
        "daysRented", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, null, $4, $5, null)
        `, [customerId, gameId, rentDate, daysRented, originalPrice])

        res.status(201).send("Aluguel inserido!")
    } catch(err){
        res.status(500).send(err.message)
    }
}