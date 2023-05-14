import { db } from "../database/database.connection.js"

//listar jogos
export async function getJogos(req, res){
    try{
        const jogos = await db.query(`SELECT * FROM games;`)
        res.send(jogos.rows)
    } catch (err){
        res.status(500).send(err.message)
    }
}

//inserir jogos
export async function postJogos(req, res){

    const {name, image, stockTotal, pricePerDay} = req.body

    try{
        const existe = await db.query(`
        SELECT EXISTS(SELECT 1 FROM games WHERE name = $1)
        `, [name])

        if(!existe){
            await db.query(`
            INSERT INTO games (name, image, "stockTotal", "pricePerDay")
                VALUES ($1, $2, $3, $4)
            `, [name, image, stockTotal, pricePerDay])
    
            res.status(201).send('Jogo inserido com sucesso!')    
        } else{
            res.status(409).send("Jogo já cadastrado!")
        }

    } catch (err){
        res.status(500).send(err.message)
    }
}