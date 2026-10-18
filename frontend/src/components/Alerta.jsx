export default function Alerta({ tipo = 'danger', mensagem, aoFechar }) {
  if (!mensagem) return null;

  return (
    <div className={`alert alert-${tipo} d-flex justify-content-between align-items-start`} role="alert">
      <span>{mensagem}</span>
      {aoFechar && (
        <button type="button" className="btn-close ms-3" aria-label="Fechar" onClick={aoFechar} />
      )}
    </div>
  );
}
