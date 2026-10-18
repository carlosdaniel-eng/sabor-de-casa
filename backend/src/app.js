const express = require('express');
const cors = require('cors');
const categoriaRoutes = require('./routes/categoriaRoutes');
const pratoRoutes = require('./routes/pratoRoutes');
const rotaNaoEncontrada = require('./middlewares/rotaNaoEncontrada');
const tratarErros = require('./middlewares/tratarErros');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API do cardápio Sabor de Casa funcionando' });
});

app.use('/categorias', categoriaRoutes);
app.use('/pratos', pratoRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;
