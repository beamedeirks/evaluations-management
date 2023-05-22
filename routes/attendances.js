const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//insere um atendimento 
router.post('/', login.required, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      `INSERT INTO attendances 
      (systemProtocol, date,noteFinal, idEvaluator, idAttendant, idTypeOfAttendance) 
      VALUES (?, ?, ?, ?, ?, ?);`,
      [
        req.body.systemProtocol,
        req.body.date,
        req.body.noteFinal,
        req.body.idEvaluator,
        req.body.idAttendant,
        req.body.idTypeOfAttendance
      ],
      (error, result, field) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        res.status(201).send({
          message: 'Atendimento inserido com sucesso!',
          idAttendance: result.insertId
        });
      }
    )
  })
});

//retorna todos os atendimentos 
router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    conn.query(
      'SELECT * FROM attendances;',
      (error, result, fields) => {
        if (error) { return res.status(500).send({ error: error }) }
        const dataResponseGetAttendances = {
          amount: result.length,
          attendances: result.map(attendance => {
            return {
              idAttendance: attendance.idAttendance,
              systemProtocol: attendance.systemProtocol,
              date: attendance.date,
              attendanceDescription: attendance.attendanceDescription,
              mistakesDescription: attendance.mistakesDescription,
              noteFinal: attendance.noteFinal,
              idEvaluator: attendance.idEvaluator,
              idAttendant: attendance.idAttendant,
              idTypeOfAttendance: attendance.idTypeOfAttendance,
              created_at: attendance.created_at,
            }
          })

        }
        return res.status(200).send(dataResponseGetAttendances)
      }
    )
  })
});


module.exports = router;