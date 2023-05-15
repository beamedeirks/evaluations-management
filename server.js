//vai ser executado antes de mais nada
//import http from 'http';
//import app from './app';

const http = require('http'); //cria um serviço de http
const app = require('./app'); //referenciando o arquivo app.js
const port = process.env.PORT || 3001; //define uma porta padrão
const server = http.createServer(app); //cria o server passando o app

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});