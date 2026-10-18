// Erro "esperado" da aplicação: já carrega o status HTTP e a mensagem pro usuário
class AppError extends Error {
  constructor(mensagem, status = 400, campos = undefined) {
    super(mensagem);
    this.status = status;
    this.campos = campos;
  }
}

module.exports = AppError;
