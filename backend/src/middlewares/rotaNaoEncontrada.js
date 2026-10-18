function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: `Rota ${req.method} ${req.originalUrl} não existe.` });
}

module.exports = rotaNaoEncontrada;
