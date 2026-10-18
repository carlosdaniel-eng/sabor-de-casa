import formatarPreco from '../utils/formatarPreco';

export default function TabelaPratos({ pratos, aoEditar, aoExcluir }) {
  if (pratos.length === 0) {
    return <p className="text-muted mb-0">Essa categoria ainda não tem pratos.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Prato</th>
            <th>Preço</th>
            <th>Situação</th>
            <th className="tabela-acoes">Ações</th>
          </tr>
        </thead>
        <tbody>
          {pratos.map((prato) => (
            <tr key={prato.id} className={prato.disponivel ? '' : 'prato-indisponivel'}>
              <td>
                <div className="fw-semibold">{prato.nome}</div>
                {prato.descricao && <small className="text-muted">{prato.descricao}</small>}
              </td>
              <td>{formatarPreco(prato.preco)}</td>
              <td>
                {prato.disponivel ? (
                  <span className="badge text-bg-success">Disponível</span>
                ) : (
                  <span className="badge text-bg-secondary">Esgotado</span>
                )}
              </td>
              <td className="tabela-acoes">
                <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => aoEditar(prato)}>
                  Editar
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => aoExcluir(prato)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
