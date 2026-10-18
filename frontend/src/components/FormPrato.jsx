import CampoFormulario from './CampoFormulario';

export default function FormPrato({ valores, erros, salvando, aoAlterar, aoEnviar, aoCancelar }) {
  const editando = Boolean(valores.id);

  return (
    <form onSubmit={aoEnviar} noValidate>
      <h2 className="h5 mb-3">{editando ? 'Editar prato' : 'Novo prato'}</h2>

      <CampoFormulario
        id="nome"
        rotulo="Nome do prato"
        obrigatorio
        maxLength={80}
        placeholder="Ex.: Frango grelhado com arroz e feijão"
        value={valores.nome}
        onChange={aoAlterar}
        erro={erros.nome}
      />
      <CampoFormulario
        id="descricao"
        rotulo="Descrição"
        multilinha
        maxLength={300}
        placeholder="Acompanhamentos, observações..."
        value={valores.descricao}
        onChange={aoAlterar}
        erro={erros.descricao}
      />
      <CampoFormulario
        id="preco"
        rotulo="Preço (R$)"
        obrigatorio
        type="number"
        min="0.01"
        step="0.01"
        placeholder="0,00"
        value={valores.preco}
        onChange={aoAlterar}
        erro={erros.preco}
      />

      <div className="form-check mb-3">
        <input
          id="disponivel"
          name="disponivel"
          type="checkbox"
          className="form-check-input"
          checked={valores.disponivel}
          onChange={aoAlterar}
        />
        <label htmlFor="disponivel" className="form-check-label">
          Disponível hoje
        </label>
      </div>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-principal" disabled={salvando}>
          {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Adicionar prato'}
        </button>
        {editando && (
          <button type="button" className="btn btn-outline-secondary" onClick={aoCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
