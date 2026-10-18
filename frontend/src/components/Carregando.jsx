export default function Carregando({ texto = 'Carregando...' }) {
  return (
    <div className="text-center text-muted py-4">
      <div className="spinner-border spinner-border-sm me-2" role="status" />
      {texto}
    </div>
  );
}
