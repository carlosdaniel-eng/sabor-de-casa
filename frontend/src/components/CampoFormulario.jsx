// Label + input + mensagem de erro do campo, usado nos dois formulários
export default function CampoFormulario({ id, rotulo, erro, obrigatorio, multilinha, ...props }) {
  const Elemento = multilinha ? 'textarea' : 'input';

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {rotulo} {obrigatorio && <span className="text-danger">*</span>}
      </label>
      <Elemento
        id={id}
        name={id}
        className={`form-control ${erro ? 'is-invalid' : ''}`}
        rows={multilinha ? 2 : undefined}
        {...props}
      />
      {erro && <div className="invalid-feedback">{erro}</div>}
    </div>
  );
}
