import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buscarCategoria, salvarCategoria } from '../services/categoriaService';
import { lerErro } from '../services/api';
import { validarFormCategoria, temErros } from '../utils/validacoes';
import useFormulario from '../utils/useFormulario';
import Alerta from '../components/Alerta';
import CampoFormulario from '../components/CampoFormulario';
import Carregando from '../components/Carregando';

const CATEGORIA_VAZIA = { nome: '', descricao: '' };

export default function FormCategoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const { valores, setValores, erros, setErros, alterarCampo } = useFormulario(CATEGORIA_VAZIA);
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando) return;

    buscarCategoria(id)
      .then((categoria) => setValores({ nome: categoria.nome, descricao: categoria.descricao || '' }))
      .catch((e) => setErroGeral(lerErro(e).mensagem))
      .finally(() => setCarregando(false));
  }, [id]);

  async function enviar(evento) {
    evento.preventDefault();
    setErroGeral('');

    const errosDoForm = validarFormCategoria(valores);
    if (temErros(errosDoForm)) {
      setErros(errosDoForm);
      return;
    }

    setSalvando(true);
    try {
      const categoria = await salvarCategoria({ id, ...valores });
      const acao = editando ? 'atualizada' : 'cadastrada';
      navigate('/', { state: { mensagem: `Categoria "${categoria.nome}" ${acao} com sucesso.` } });
    } catch (e) {
      const { mensagem, campos } = lerErro(e);
      setErroGeral(mensagem);
      setErros(campos);
      setSalvando(false);
    }
  }

  if (carregando) return <Carregando />;

  return (
    <div className="cartao col-lg-7 mx-auto">
      <h1 className="h4 mb-3">{editando ? 'Editar categoria' : 'Nova categoria'}</h1>

      <Alerta mensagem={erroGeral} />

      <form onSubmit={enviar} noValidate>
        <CampoFormulario
          id="nome"
          rotulo="Nome"
          obrigatorio
          maxLength={60}
          placeholder="Ex.: Executivos, Fitness, Sobremesas"
          value={valores.nome}
          onChange={alterarCampo}
          erro={erros.nome}
        />
        <CampoFormulario
          id="descricao"
          rotulo="Descrição"
          multilinha
          maxLength={200}
          placeholder="Opcional"
          value={valores.descricao}
          onChange={alterarCampo}
          erro={erros.descricao}
        />

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-principal" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
          <Link to="/" className="btn btn-outline-secondary">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
