import api from './api';

export async function listarPratosDaCategoria(categoriaId) {
  const { data } = await api.get(`/categorias/${categoriaId}/pratos`);
  return data;
}

export async function salvarPrato(prato) {
  const { data } = prato.id
    ? await api.put(`/pratos/${prato.id}`, prato)
    : await api.post('/pratos', prato);
  return data;
}

export async function excluirPrato(id) {
  await api.delete(`/pratos/${id}`);
}
