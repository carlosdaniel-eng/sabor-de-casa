// Na Vercel a API roda como função serverless: todas as chamadas a /api/* caem aqui
// e são repassadas para o mesmo app Express usado localmente (backend/src/app.js).
const express = require('express');
const app = require('../backend/src/app');

const servidor = express();
servidor.use('/api', app);

module.exports = servidor;
