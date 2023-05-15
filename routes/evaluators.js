const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//insere um Avaliador 
router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'INSERT INTO evaluators (nameEvaluator) VALUES (?);',
      [req.body.nameEvaluator],
      (error, result, field) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        res.status(201).send({
          message: 'Avaliador inserido com sucesso!',
          idEvaluator: result.insertId
        });
      }
    )
  })
});

//retorna todos os avaliadores 
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM evaluators;',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        const dataResponseGetEvaluators = {
          amount: result.length,
          evaluators: result.map(attendant => {
            return {
              idEvaluator: attendant.idEvaluator,
              nameEvaluator: attendant.nameEvaluator
            }
          })

        }
        return res.status(200).send(dataResponseGetEvaluators)
      }
    )
  })
});

//retorna um Avaliador por id
router.get('/:idEvaluator', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM evaluators WHERE idEvaluator = ?;',
      [req.params.idEvaluator],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        return res.status(200).send({ response: result })
      }
    )
  })
});

//alterando status do Avaliador - 1 (active) e 0 (inactive)
router.patch('/status', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `UPDATE evaluators 
          SET active = ?
        WHERE idEvaluator  = ?`,
      [
        req.body.active,
        req.body.idEvaluator
      ],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Status do avaliador alterado com sucesso!'
        });
      }
    )
  });
});

//altera o nome do Avaliador
router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `UPDATE evaluators 
          SET nameEvaluator = ?
        WHERE idEvaluator  = ?`,
      [
        req.body.nameEvaluator,
        req.body.idEvaluator
      ],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Avaliador alterado com sucesso!'
        });
      }
    )
  });
});

//exclui Avaliador - não usado
router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `DELETE FROM evaluators WHERE idEvaluator = ?`,
      [req.body.idEvaluator],
      (error, result, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }

        res.status(202).send({
          message: 'Avaliador removido com sucesso!'
        });
      }
    )
  });
});

module.exports = router;