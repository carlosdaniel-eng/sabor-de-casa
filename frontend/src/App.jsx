import { Routes, Route } from 'react-router-dom';
import Cabecalho from './components/Cabecalho';
import ListaCategorias from './pages/ListaCategorias';
import FormCategoria from './pages/FormCategoria';
import PratosDaCategoria from './pages/PratosDaCategoria';
import PaginaNaoEncontrada from './pages/PaginaNaoEncontrada';

export default function App() {
  return (
    <>
      <Cabecalho />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<ListaCategorias />} />
          <Route path="/categorias/nova" element={<FormCategoria />} />
          <Route path="/categorias/:id/editar" element={<FormCategoria />} />
          <Route path="/categorias/:id/pratos" element={<PratosDaCategoria />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}
