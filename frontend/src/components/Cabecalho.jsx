import { Link } from 'react-router-dom';

export default function Cabecalho() {
  return (
    <nav className="navbar navbar-dark cabecalho">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src="/marmita.svg" alt="" />
          Sabor de Casa
        </Link>
        <span className="navbar-text text-white-50 d-none d-sm-inline">Cardápio digital</span>
      </div>
    </nav>
  );
}
