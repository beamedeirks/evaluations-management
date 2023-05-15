const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')

const routerAttendants = require('./routes/attendants');
//const routerAttendances = require('./routes/attendances');
const routerEvaluators = require('./routes/evaluators');
//const routerTypesOfAttendances = require('./routes/typesOfAttendances');

//monitorar toda a execução e retornar um log no terminal
app.use(morgan('dev'));
//definir o corpo da requisição 
app.use(bodyParser.urlencoded({ extends: false})); // apenas dados simples
app.use(bodyParser.json()); // json de entrada no body

//CORS
app.use((req, res, next) => {
  res.header('Acces-Control-Allow-Origin', '*');
  res.header(('Acces-Control-Allow-Header', 
  'Origin, X-Requested-With, Content-Type, Accept, Authorization'));

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({});
  }
  next();
})

app.use('/attendants', routerAttendants);
//app.use('/attendances', routerAttendances);
app.use('/evaluators', routerEvaluators);
//app.use('/typesOfAttendances', routerTypesOfAttendances);

//quando não encontrar nenhuma rota
app.use((req, res, next) =>{
  const erro = new Error('Não encontrado');
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    error: {
      message: error.message
    }
  });
});

module.exports = app; //exportando o arquivo
