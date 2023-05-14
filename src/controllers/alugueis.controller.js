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
/*
- **Regras de Negócio**
    - Ao inserir um aluguel, os campos `rentDate` e `originalPrice` devem ser populados 
    automaticamente antes de salvá-lo:
        - `rentDate`: data atual no momento da inserção.
        - `originalPrice`: `daysRented` multiplicado pelo preço por dia do jogo no momento 
        da inserção.
    - Ao inserir um aluguel, os campos `returnDate` e `delayFee` devem sempre começar como `null`.
    - Ao inserir um aluguel, deve verificar se `customerId` se refere a um cliente existente. 
    Se não, deve responder com **status 400.**
    - Ao inserir um aluguel, deve verificar se `gameId` se refere a um jogo existente. 
    Se não, deve responder com **status 400.**
    - `daysRented` deve ser um número maior que 0. Se não, deve responder com **status 400.**
    - Ao inserir um aluguel, deve-se validar que existem jogos disponíveis, ou seja, que não tem
     alugueis em aberto acima da quantidade de jogos em estoque. Caso contrário, deve retornar 
     **status 400.**
*/
export async function postAlugueis(req, res){
    const { customerId, gameId, daysRented } = req.body

    try{
        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
            VALUES ($1, $2, $3, ${dayjs().format('YYYY-MM-DD')}, $3*)
        `, [customerId, gameId, daysRented])

        res.status(201).send("Aluguel inserido!")
    } catch(err){
        res.status(500).send(err.message)
    }
}