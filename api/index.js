// Ponto de entrada serverless na Vercel: encaminha /api/* para a aplicação Express.
const express = require('express');
require('../backend/src/database/criarTabelas');
const app = require('../backend/src/app');

const servidor = express();
servidor.use('/api', app);

module.exports = servidor;
