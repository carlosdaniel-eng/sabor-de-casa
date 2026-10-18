import api from './api';

export async function listarCategorias() {
  const { data } = await api.get('/categorias');
  return data;
}

export async function buscarCategoria(id) {
  const { data } = await api.get(`/categorias/${id}`);
  return data;
}

export async function salvarCategoria(categoria) {
  const { data } = categoria.id
    ? await api.put(`/categorias/${categoria.id}`, categoria)
    : await api.post('/categorias', categoria);
  return data;
}

export async function excluirCategoria(id) {
  await api.delete(`/categorias/${id}`);
}
