import { db } from "../database/database.connection.js";

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

        const existe = await db.query(`
        SELECT EXISTS(SELECT 1 FROM customers WHERE cpf = $1)
        `, [cpf])

        if(!existe.rows[0].exists){
            await db.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
                VALUES ($1, $2, $3, $4)
            `, [name, phone, cpf, birthday])
    
            res.status(201).send("Cliente inserido com sucesso!")    
        } else{
            res.status(409).send("Cliente já cadastrado!")
        }

    } catch(err){
        res.status(500).send(err.message)
    }
}

//buscar cliente por id
export async function getClientesId(req, res){
    const {id} = req.params

    try{
        const cliente = await db.query(`
        SELECT  id, name, phone, cpf, birthday FROM customers WHERE id = $1;
        `, [id])
        if(cliente.rows.length==0){
            res.status(404). send("Cliente não cadastrado!")
        } else{
            res.send(cliente.rows[0])
        }
    } catch(err){
        res.status(500).send(err.message)
    }
}

//alterar cliente por id
export async function putClientes(req, res){
    
}