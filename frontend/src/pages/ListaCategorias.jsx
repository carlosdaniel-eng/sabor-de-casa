import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { listarCategorias, excluirCategoria } from '../services/categoriaService';
import { lerErro } from '../services/api';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';

export default function ListaCategorias() {
  const location = useLocation();
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(location.state?.mensagem || '');

  async function carregarCategorias() {
    try {
      setCategorias(await listarCategorias());
    } catch (e) {
      setErro(lerErro(e).mensagem);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function excluir(categoria) {
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return;

    setErro('');
    setSucesso('');
    try {
      await excluirCategoria(categoria.id);
      setCategorias((lista) => lista.filter((c) => c.id !== categoria.id));
      setSucesso(`Categoria "${categoria.nome}" excluída.`);
    } catch (e) {
      setErro(lerErro(e).mensagem);
    }
  }

  return (
    <div className="cartao">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Categorias do cardápio</h1>
        <Link to="/categorias/nova" className="btn btn-principal">
          + Nova categoria
        </Link>
      </div>

      <Alerta mensagem={erro} aoFechar={() => setErro('')} />
      <Alerta tipo="success" mensagem={sucesso} aoFechar={() => setSucesso('')} />

      {carregando ? (
        <Carregando />
      ) : categorias.length === 0 ? (
        <p className="text-muted mb-0">Nenhuma categoria cadastrada ainda. Comece criando uma!</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th className="text-center">Pratos</th>
                <th className="tabela-acoes">Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td className="fw-semibold">{categoria.nome}</td>
                  <td className="text-muted">{categoria.descricao || '—'}</td>
                  <td className="text-center">{categoria.totalPratos}</td>
                  <td className="tabela-acoes">
                    <Link to={`/categorias/${categoria.id}/pratos`} className="btn btn-sm btn-outline-dark me-1">
                      Ver pratos
                    </Link>
                    <Link to={`/categorias/${categoria.id}/editar`} className="btn btn-sm btn-outline-secondary me-1">
                      Editar
                    </Link>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => excluir(categoria)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
