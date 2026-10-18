import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 15000,
});

// Transforma qualquer falha do axios em { mensagem, campos } pra tela mostrar
export function lerErro(erro) {
  if (erro.response) {
    return {
      mensagem: erro.response.data?.erro || 'Ocorreu um erro ao processar a requisição.',
      campos: erro.response.data?.campos || {},
    };
  }
  return {
    mensagem: 'Não foi possível falar com o servidor. Verifique sua conexão e tente de novo.',
    campos: {},
  };
}

export default api;
