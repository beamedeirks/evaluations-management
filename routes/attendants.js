const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//insere um atendente 
router.post('/', login.required,(req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'INSERT INTO attendants(nameAttendant) VALUES (?);',
      [req.body.nameAttendant],
      (error, result, field) => {
        conn.release(); //liberar a conexão por conta do limite de pool abertas
        if (error) { return res.status(500).send({ error: error }) }
        res.status(201).send({
          message: 'Atendente inserido com sucesso!',
          idAttendant: result.insertId
        });
      }
    )
  })
});

//retorna todos os atendentes 
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM attendants;',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        const dataResponseGetAttendants = {
          amount: result.length,
          attendants : result.map( attendant =>{
            return{
              idAttendant: attendant.idAttendant,
              nameAttendant: attendant.nameAttendant
            }
          })

        }
        return res.status(200).send(dataResponseGetAttendants)
      }
    )
  })
});

//retorna um atendente por id
router.get('/:idAttendant', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM attendants WHERE idAttendant = ?;',
      [req.params.idAttendant],
      (error, result, fields) => {
        conn.release(); 
        if (error) { return res.status(500).send({ error: error }) }
        return res.status(200).send({ response: result })
      }
    )
  })
});

//alterando status do atendente - 1 (active) e 0 (inactive)
router.patch('/status', login.required, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `UPDATE attendants 
          SET active = ?
        WHERE idAttendant  = ?`,
      [
        req.body.active,
        req.body.idAttendant
      ],
      (error, result, fields) => {
        conn.release(); 
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Status do atendente alterado com sucesso!'
        });
      }
    )
  });
});

//altera o nome do atendente
router.patch('/', login.required, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `UPDATE attendants 
          SET nameAttendant = ?
        WHERE idAttendant  = ?`,
      [
        req.body.nameAttendant,
        req.body.idAttendant
      ],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Atendente alterado com sucesso!'
        });
      }
    )
  });
});

//exclui atendente - não usado
router.delete('/', login.required, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `DELETE FROM attendants WHERE idAttendant = ?`,
      [req.body.idAttendant],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Atendente removido com sucesso!'
        });
      }
    )
  });
});

module.exports = router;