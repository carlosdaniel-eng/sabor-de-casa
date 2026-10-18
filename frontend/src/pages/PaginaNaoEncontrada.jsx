import { Link } from 'react-router-dom';

export default function PaginaNaoEncontrada() {
  return (
    <div className="cartao text-center">
      <h1 className="h4">Página não encontrada</h1>
      <p className="text-muted">O endereço digitado não existe.</p>
      <Link to="/" className="btn btn-principal">
        Voltar para as categorias
      </Link>
    </div>
  );
}
