import { db } from "../database/database.connection";

//listar clientes
export async function getClientes(req, res){
    try{
        const clientes = await db.query(`SELECT * FROM customers;`)
        res.send(clientes.rows)
    } catch(err){
        res.status(500).send(err.message)
    }
}

//inserir clientes
export async function postClientes(req, res){
    const { name, phone, cpf, birthday } = req.body

    try{
        await db.query(`
        INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `, [name, phone, cpf, birthday])

        res.status(201).send("Cliente inserido com sucesso!")
    } catch(err){
        res.status(500).send(err.message)
    }
}