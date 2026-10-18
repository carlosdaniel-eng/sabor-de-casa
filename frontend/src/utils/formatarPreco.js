const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function formatarPreco(valor) {
  return formatador.format(valor);
}
