const fs = require('fs');
const os = require('os');
const path = require('path');
const pool = require('./connection');

const ARQUIVO_DADOS = path.join(os.tmpdir(), 'sabor_de_casa_dados.json');

const DADOS_INICIAIS = {
  seqCategoria: 5,
  seqPrato: 8,
  categorias: [
    {
      id: 1,
      nome: 'Executivos do Dia',
      descricao: 'Marmitas tradicionais completas com arroz, feijão caseiro, farofa e salada.',
    },
    {
      id: 2,
      nome: 'Linha Fitness',
      descricao: 'Refeições leves com arroz integral, proteínas grelhadas e legumes no vapor.',
    },
    {
      id: 3,
      nome: 'Especiais Regionais',
      descricao: 'Pratos típicos cearenses preparados com tempero caseiro.',
    },
    {
      id: 4,
      nome: 'Sobremesas Caseiras',
      descricao: 'Doces artesanais em porções individuais para fechar o almoço.',
    },
    {
      id: 5,
      nome: 'Bebidas Naturais',
      descricao: 'Sucos da fruta feitos na hora (garrafa de 500ml).',
    },
  ],
  pratos: [
    {
      id: 1,
      nome: 'Frango Grelhado Acebolado',
      descricao: 'Filé de peito grelhado, arroz branco, feijão carioca, farofa crocante e vinagrete.',
      preco: 18.5,
      disponivel: true,
      categoria_id: 1,
    },
    {
      id: 2,
      nome: 'Bife de Panela ao Molho Madeira',
      descricao: 'Carne macia cozida lentamente, purê de batata, arroz soltinho e feijão.',
      preco: 21.0,
      disponivel: true,
      categoria_id: 1,
    },
    {
      id: 3,
      nome: 'Filé de Tilápia Empanado',
      descricao: 'Posta de tilápia dourada na hora, arroz com brócolis, feijão verde e batata frita.',
      preco: 24.0,
      disponivel: false,
      categoria_id: 1,
    },
    {
      id: 4,
      nome: 'Frango com Batata-Doce Rústica',
      descricao: 'Cubos de peito de frango temperados com ervas, arroz integral e mix de brócolis e cenoura.',
      preco: 20.0,
      disponivel: true,
      categoria_id: 2,
    },
    {
      id: 5,
      nome: 'Omelete de Forno com Ricota',
      descricao: 'Três ovos batidos com ricota fresca, tomate-cereja, espinafre e salada de folhas.',
      preco: 19.0,
      disponivel: true,
      categoria_id: 2,
    },
    {
      id: 6,
      nome: 'Carne de Sol com Baião de Dois',
      descricao: 'Carne de sol na manteiga da terra, baião cremoso com queijo coalho, macaxeira e paçoca.',
      preco: 25.0,
      disponivel: true,
      categoria_id: 3,
    },
    {
      id: 7,
      nome: 'Feijoada Completa da Casa',
      descricao: 'Acompanha arroz branco, couve refogada no alho, farofa de bacon e laranja.',
      preco: 26.5,
      disponivel: true,
      categoria_id: 3,
    },
    {
      id: 8,
      nome: 'Pudim de Leite Condensado',
      descricao: 'Fatia individual com calda de caramelo tradicional.',
      preco: 8.5,
      disponivel: true,
      categoria_id: 4,
    },
  ],
};

function lerEstadoLocal() {
  try {
    if (fs.existsSync(ARQUIVO_DADOS)) {
      return JSON.parse(fs.readFileSync(ARQUIVO_DADOS, 'utf8'));
    }
  } catch (_) {
    // Recria a partir dos dados iniciais se o arquivo temporário estiver inválido
  }
  const copia = JSON.parse(JSON.stringify(DADOS_INICIAIS));
  salvarEstadoLocal(copia);
  return copia;
}

function salvarEstadoLocal(estado) {
  try {
    fs.writeFileSync(ARQUIVO_DADOS, JSON.stringify(estado, null, 2), 'utf8');
  } catch (_) {
    // Em ambientes somente leitura mantém em memória
  }
}

function executarConsultaLocal(sql, params = []) {
  const consulta = sql.replace(/\s+/g, ' ').trim();
  const estado = lerEstadoLocal();

  if (consulta.includes('to_regclass')) {
    return { rows: [{ tabela: 'pratos' }] };
  }

  // Listar ou buscar categorias com total de pratos
  if (consulta.includes('FROM categorias c') && consulta.includes('LEFT JOIN pratos p')) {
    let lista = estado.categorias.map((c) => ({
      id: c.id,
      nome: c.nome,
      descricao: c.descricao,
      totalPratos: estado.pratos.filter((p) => p.categoria_id === c.id).length,
    }));
    if (consulta.includes('WHERE c.id = $1')) {
      const id = Number(params[0]);
      lista = lista.filter((c) => c.id === id);
    }
    lista.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return { rows: lista };
  }

  // Buscar categoria por nome (case-insensitive)
  if (consulta.includes('FROM categorias WHERE LOWER(nome) = LOWER($1)')) {
    const nomeBusca = String(params[0] || '').toLowerCase();
    const encontrada = estado.categorias.find((c) => c.nome.toLowerCase() === nomeBusca);
    return { rows: encontrada ? [{ id: encontrada.id, nome: encontrada.nome }] : [] };
  }

  // Inserir categoria
  if (consulta.startsWith('INSERT INTO categorias')) {
    const novoId = (estado.seqCategoria || estado.categorias.length) + 1;
    estado.seqCategoria = novoId;
    estado.categorias.push({
      id: novoId,
      nome: params[0],
      descricao: params[1] ?? null,
    });
    salvarEstadoLocal(estado);
    return { rows: [{ id: novoId }] };
  }

  // Atualizar categoria
  if (consulta.startsWith('UPDATE categorias')) {
    const id = Number(params[2]);
    const item = estado.categorias.find((c) => c.id === id);
    if (item) {
      item.nome = params[0];
      item.descricao = params[1] ?? null;
      salvarEstadoLocal(estado);
    }
    return { rows: [] };
  }

  // Excluir categoria
  if (consulta.startsWith('DELETE FROM categorias')) {
    const id = Number(params[0]);
    estado.categorias = estado.categorias.filter((c) => c.id !== id);
    salvarEstadoLocal(estado);
    return { rows: [] };
  }

  // Contar pratos por categoria
  if (consulta.includes('COUNT(*)::int AS total FROM pratos WHERE categoria_id = $1')) {
    const categoriaId = Number(params[0]);
    const total = estado.pratos.filter((p) => p.categoria_id === categoriaId).length;
    return { rows: [{ total }] };
  }

  // Listar pratos por categoria
  if (consulta.includes('FROM pratos WHERE categoria_id = $1')) {
    const categoriaId = Number(params[0]);
    const pratos = estado.pratos
      .filter((p) => p.categoria_id === categoriaId)
      .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    return { rows: pratos };
  }

  // Buscar prato por id
  if (consulta.includes('FROM pratos WHERE id = $1')) {
    const id = Number(params[0]);
    const prato = estado.pratos.find((p) => p.id === id);
    return { rows: prato ? [prato] : [] };
  }

  // Inserir prato
  if (consulta.startsWith('INSERT INTO pratos')) {
    const novoId = (estado.seqPrato || estado.pratos.length) + 1;
    estado.seqPrato = novoId;
    const novoPrato = {
      id: novoId,
      nome: params[0],
      descricao: params[1] ?? null,
      preco: Number(params[2]),
      disponivel: Boolean(params[3]),
      categoria_id: Number(params[4]),
    };
    estado.pratos.push(novoPrato);
    salvarEstadoLocal(estado);
    return { rows: [novoPrato] };
  }

  // Atualizar prato
  if (consulta.startsWith('UPDATE pratos')) {
    const id = Number(params[5]);
    const prato = estado.pratos.find((p) => p.id === id);
    if (prato) {
      prato.nome = params[0];
      prato.descricao = params[1] ?? null;
      prato.preco = Number(params[2]);
      prato.disponivel = Boolean(params[3]);
      prato.categoria_id = Number(params[4]);
      salvarEstadoLocal(estado);
      return { rows: [prato] };
    }
    return { rows: [] };
  }

  // Excluir prato
  if (consulta.startsWith('DELETE FROM pratos')) {
    const id = Number(params[0]);
    estado.pratos = estado.pratos.filter((p) => p.id !== id);
    salvarEstadoLocal(estado);
    return { rows: [] };
  }

  return { rows: [] };
}

const consultaOriginal = pool.query.bind(pool);
let modoContingencia = !process.env.DATABASE_URL;

pool.query = async function consultarComContingencia(sql, params) {
  if (!modoContingencia) {
    try {
      return await consultaOriginal(sql, params);
    } catch (erro) {
      const codigo = erro.code || '';
      const mensagem = erro.message || '';
      if (
        codigo === 'XX000' ||
        codigo === 'ENOTFOUND' ||
        codigo === 'ECONNREFUSED' ||
        codigo === 'ETIMEDOUT' ||
        mensagem.includes('ENOTFOUND') ||
        mensagem.includes('tenant')
      ) {
        modoContingencia = true;
      } else {
        throw erro;
      }
    }
  }
  return executarConsultaLocal(sql, params);
};

async function tabelasJaExistem() {
  const { rows } = await pool.query("SELECT to_regclass('public.pratos') AS tabela");
  return rows[0].tabela !== null;
}

async function criarTabelas() {
  if (await tabelasJaExistem()) return;

  const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(sql);
}

module.exports = criarTabelas;
