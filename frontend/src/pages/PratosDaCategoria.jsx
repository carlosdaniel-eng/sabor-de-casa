import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { buscarCategoria } from '../services/categoriaService';
import { listarPratosDaCategoria, salvarPrato, excluirPrato } from '../services/pratoService';
import { lerErro } from '../services/api';
import { validarFormPrato, temErros } from '../utils/validacoes';
import useFormulario from '../utils/useFormulario';
import Alerta from '../components/Alerta';
import Carregando from '../components/Carregando';
import FormPrato from '../components/FormPrato';
import TabelaPratos from '../components/TabelaPratos';

const PRATO_VAZIO = { id: null, nome: '', descricao: '', preco: '', disponivel: true };

export default function PratosDaCategoria() {
  const { id: categoriaId } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [pratos, setPratos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const form = useFormulario(PRATO_VAZIO);

  useEffect(() => {
    Promise.all([buscarCategoria(categoriaId), listarPratosDaCategoria(categoriaId)])
      .then(([categoriaEncontrada, pratosDaCategoria]) => {
        setCategoria(categoriaEncontrada);
        setPratos(pratosDaCategoria);
      })
      .catch((e) => setErro(lerErro(e).mensagem))
      .finally(() => setCarregando(false));
  }, [categoriaId]);

  function limparMensagens() {
    setErro('');
    setSucesso('');
  }

  function editar(prato) {
    limparMensagens();
    form.setErros({});
    form.setValores({ ...prato, descricao: prato.descricao || '', preco: String(prato.preco) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function atualizarLista(pratoSalvo) {
    setPratos((lista) => {
      const semOAntigo = lista.filter((p) => p.id !== pratoSalvo.id);
      return [...semOAntigo, pratoSalvo].sort((a, b) => a.nome.localeCompare(b.nome));
    });
  }

  async function enviar(evento) {
    evento.preventDefault();
    limparMensagens();

    const errosDoForm = validarFormPrato(form.valores);
    if (temErros(errosDoForm)) {
      form.setErros(errosDoForm);
      return;
    }

    setSalvando(true);
    try {
      const pratoSalvo = await salvarPrato({ ...form.valores, categoriaId: Number(categoriaId) });
      atualizarLista(pratoSalvo);
      setSucesso(`Prato "${pratoSalvo.nome}" salvo com sucesso.`);
      form.limpar();
    } catch (e) {
      const { mensagem, campos } = lerErro(e);
      setErro(mensagem);
      form.setErros(campos);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(prato) {
    if (!window.confirm(`Excluir o prato "${prato.nome}"?`)) return;

    limparMensagens();
    try {
      await excluirPrato(prato.id);
      setPratos((lista) => lista.filter((p) => p.id !== prato.id));
      setSucesso(`Prato "${prato.nome}" excluído.`);
      if (form.valores.id === prato.id) form.limpar();
    } catch (e) {
      setErro(lerErro(e).mensagem);
    }
  }

  if (carregando) return <Carregando />;

  if (!categoria) {
    return (
      <div className="cartao">
        <Alerta mensagem={erro || 'Categoria não encontrada.'} />
        <Link to="/">Voltar para as categorias</Link>
      </div>
    );
  }

  return (
    <>
      <Link to="/" className="d-inline-block mb-3">
        ← Voltar para as categorias
      </Link>
      <h1 className="h4">{categoria.nome}</h1>
      {categoria.descricao && <p className="text-muted">{categoria.descricao}</p>}

      <Alerta mensagem={erro} aoFechar={() => setErro('')} />
      <Alerta tipo="success" mensagem={sucesso} aoFechar={() => setSucesso('')} />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="cartao">
            <FormPrato
              valores={form.valores}
              erros={form.erros}
              salvando={salvando}
              aoAlterar={form.alterarCampo}
              aoEnviar={enviar}
              aoCancelar={form.limpar}
            />
          </div>
        </div>
        <div className="col-lg-8">
          <div className="cartao">
            <h2 className="h5 mb-3">Pratos ({pratos.length})</h2>
            <TabelaPratos pratos={pratos} aoEditar={editar} aoExcluir={excluir} />
          </div>
        </div>
      </div>
    </>
  );
}
