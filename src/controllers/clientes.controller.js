import { db } from "../database/database.connection.js";
import dayjs from 'dayjs'

//listar clientes
export async function getClientes(req, res){
    try{
        const clientes = await db.query(`SELECT * FROM customers;`)

        const clientesFormatados = clientes.rows.map((c) => ({
            ...c,
            birthday: dayjs(c.birthday).format('YYYY-MM-DD'),
          }))

        res.send(clientesFormatados)
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
            const clienteFormatado = {
                ...cliente.rows[0],
                birthday: dayjs(cliente.rows[0].birthday).format('YYYY-MM-DD'),
              }
       
            res.send(clienteFormatado)
        }
    } catch(err){
        res.status(500).send(err.message)
    }
}

//alterar cliente por id
export async function putClientes(req, res){
    const { name, phone, cpf, birthday } = req.body
    const {id} = req.params

    try{
        const cliente = await db.query(`
        SELECT * FROM customers WHERE id = $1
        `, [id])

        if(cliente.rows.length===0){
            return res.status(404).send('Cliente não encontrado.')
        }

        const clienteComCPF = await db.query(`
        SELECT * FROM customers WHERE cpf = $1
        `, [cpf])

        if(clienteComCPF.rows.length>0 && clienteComCPF.rows[0].id !== Number(id)){
            return res.status(409).send('CPF já cadastrado para outro cliente.')
        }

        await db.query(
            'UPDATE customers SET name = $1, phone = $2, birthday = $3 WHERE id = $4',
            [name, phone, birthday, id]
        )

        res.status(200).send("Dados alterados com sucesso!")
        
    } catch(err){
        res.status(500).send(err.message)
    }
}