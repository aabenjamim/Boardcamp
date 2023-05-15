import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

//listar alugueis
export async function getAlugueis(req, res){
    try{
        const alugueis = await db.query(`
        SELECT rentals.*, customers.name as "customerName", games.name as "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        `)

        const aluguelFormatado = alugueis.rows.map((aluguel) => ({
            id: aluguel.id,
            customerId: aluguel.customerId,
            gameId: aluguel.gameId,
            rentDate: dayjs(aluguel.rentDate).format('YYYY-MM-DD'),
            daysRented: aluguel.daysRented,
            returnDate: aluguel.returnDate,
            originalPrice: aluguel.originalPrice,
            delayFee: aluguel.delayFee,
            customer: {
              id: aluguel.customerId,
              name: aluguel.customerName,
            },
            game: {
              id: aluguel.gameId,
              name: aluguel.gameName,
            },
          }))

        res.send(aluguelFormatado)
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

//finalizar alugueis
export async function postRetorno(req, res) {
    const { id } = req.params;
  
    try {
      const aluguel = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
      if (aluguel.rows.length === 0) {
        return res.status(404).send("Aluguel não encontrado!");
      }
  
      const finalizado = await db.query(`
        SELECT * FROM rentals 
        WHERE "returnDate" IS NOT NULL
        AND id=$1;
      `, [id]);
      if (finalizado.rows.length !== 0) {
        return res.status(400).send("Aluguel já finalizado!");
      }
  
      const returnDate = dayjs().format('YYYY-MM-DD');
      const rentDate = dayjs(aluguel.rows[0].rentDate).format('YYYY-MM-DD');
      const daysRented = aluguel.rows[0].daysRented;
      const pricePerDay = aluguel.rows[0].pricePerDay;
  
      let delayFee = null;
      const diffInDays = dayjs(returnDate).diff(rentDate, 'day');
      if (diffInDays > daysRented) {
        const daysOfDelay = diffInDays - daysRented;
        delayFee = daysOfDelay * pricePerDay;
      }
  
      await db.query(`
        UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3
      `, [returnDate, delayFee, id]);
  
      res.status(200).send("Aluguel retornado com sucesso!");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  
//apagar aluguel
export async function deleteAluguel(req, res){
    const {id} = req.params

    try{
        const aluguel = await db.query(`SELECT * FROM rentals WHERE id=$1`,
        [id])
        if(aluguel.rows.length === 0){
            return res.status(404).send("Aluguel não encontrado!")
        }

        const finalizado = await db.query(`
        SELECT * FROM rentals 
        WHERE "returnDate" IS NOT NULL
        AND id=$1;`, [id])
        if(finalizado.rows.length === 0){
            return res.status(400).send("Aluguel ainda não finalizado!")
        }

        await db.query(`DELETE FROM rentals WHERE id = $1;`, [id])

        res.status(200).send("Aluguel deletado!")
    } catch(err){
        res.status(500).send(err.message)
    }
}