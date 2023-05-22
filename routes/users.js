const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
/*
router.post('/register', (req, res, next) => {
 mysql.getConnection((error, conn) => {
   if (error) { return res.status(500).send({ error: error }) }
   conn.query(
     'SELECT * FROM users WHERE login = ?',
     [req.body.login],
     (error, results) => {
       conn.release();
       if (error) { return res.status(500).send({ error: error }) }
       if (results.length > 0) {
         return res.status(409).send({ error: 'User already exists' })
       } else {
         bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
           if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
           conn.query(
             `INSERT INTO users (login, password, name, email, idUserGroup)
         VALUES (?,?,?,?,?)`,
             [req.body.login, hash, req.body.name, req.body.email, req.body.idUserGroup],
             (error, results) => {
               conn.release();
               if (error) { return res.status(500).send({ error: error }) }
               response = {
                 mensagem: "Usuário criado com sucesso!",
                 userCreated: {
                   idUser: results.insertId,
                   login: req.body.login
                 }
               }
               return res.status(201).send(response);
             })
         })
       }
     })
 })
});*/

router.post('/register', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ error: error });
    }
    conn.query(
      'SELECT * FROM users WHERE login = ?',
      [req.body.login],
      (error, results) => {
        if (error) {
          conn.release();
          return res.status(500).send({ error: error });
        }
        if (results.length > 0) {
          conn.release();
          return res.status(409).send({ error: 'User already exists' });
        } else {
          bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              conn.release();
              return res.status(500).send({ error: errBcrypt });
            }
            conn.query(
              `INSERT INTO users (login, password, name, email, idUserGroup)
              VALUES (?,?,?,?,?)`,
              [req.body.login, hash, req.body.name, req.body.email, req.body.idUserGroup],
              (error, results) => {
                conn.release();
                if (error) {
                  return res.status(500).send({ error: error });
                }
                response = {
                  mensagem: "Usuário criado com sucesso!",
                  userCreated: {
                    idUser: results.insertId,
                    login: req.body.login
                  }
                };
                return res.status(201).send(response);
              });
          });
        }
      });
  });
});

router.post('/login', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({ error: error }) }
    const query = `SELECT * FROM users WHERE login = ?`
    conn.query(query, [req.body.login],
      (error, results, fields) => {
        conn.release();
        if (error) { return res.status(500).send({ error: error }) }
        //email não encontrado
        if (results.length < 1) {
          return res.status(401).send({ message: 'Falha na autenticação' })
        }
        bcrypt.compare(req.body.password, results[0].password, (err, result) => {
          //senha não encontrada
          if (err) {
            return res.status(401).send({ message: 'Falha na autenticação' })
          }
          if (result) {
            const token = jwt.sign({
              idUser: results[0].idUser,
              login: results[0].login,
              name: results[0].name,
              email: results[0].email,
              idUserGroup: results[0].idUserGroup
            },
              process.env.JWT_KEY,
              {
                expiresIn: '1h'
              });

            return res.status(200).send({
              message: 'Autenticado com sucesso!',
              token: token
            });
          }
          //senha inválida
          return res.status(401).send({ message: 'Login e/ou senha incorreta' })
        })

      })
  })
});

module.exports = router;