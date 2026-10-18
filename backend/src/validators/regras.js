// Funções pequenas reaproveitadas pelos validadores de categoria e prato

function textoVazio(valor) {
  return typeof valor !== 'string' || valor.trim() === '';
}

function textoMuitoLongo(valor, limite) {
  return typeof valor === 'string' && valor.trim().length > limite;
}

function precoInvalido(valor) {
  const numero = Number(valor);
  return valor === '' || valor === null || valor === undefined || Number.isNaN(numero);
}

function converterId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

module.exports = { textoVazio, textoMuitoLongo, precoInvalido, converterId };
