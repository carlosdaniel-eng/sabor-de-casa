// Validação feita antes de enviar, pra o usuário não esperar a resposta da API.
// O backend valida de novo, então aqui é só pra dar um retorno mais rápido.

function vazio(valor) {
  return !valor || valor.trim() === '';
}

export function validarFormCategoria(form) {
  const erros = {};
  if (vazio(form.nome)) erros.nome = 'O nome da categoria é obrigatório.';
  return erros;
}

export function validarFormPrato(form) {
  const erros = {};
  if (vazio(form.nome)) erros.nome = 'O nome do prato é obrigatório.';

  if (form.preco === '') {
    erros.preco = 'O preço é obrigatório.';
  } else if (Number(form.preco) <= 0) {
    erros.preco = 'O preço precisa ser maior que zero.';
  }
  return erros;
}

export function temErros(erros) {
  return Object.keys(erros).length > 0;
}
