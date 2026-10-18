import { useState } from 'react';

// Guarda os valores e os erros de um formulário. Os dois formulários do sistema usam.
export default function useFormulario(valoresIniciais) {
  const [valores, setValores] = useState(valoresIniciais);
  const [erros, setErros] = useState({});

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: type === 'checkbox' ? checked : value }));
    setErros((anteriores) => ({ ...anteriores, [name]: undefined }));
  }

  function limpar() {
    setValores(valoresIniciais);
    setErros({});
  }

  return { valores, setValores, erros, setErros, alterarCampo, limpar };
}
