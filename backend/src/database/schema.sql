CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(60) NOT NULL,
  descricao VARCHAR(200),
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS categorias_nome_unico ON categorias (LOWER(nome));

CREATE TABLE IF NOT EXISTS pratos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  descricao VARCHAR(300),
  preco NUMERIC(10, 2) NOT NULL CHECK (preco > 0),
  disponivel BOOLEAN NOT NULL DEFAULT TRUE,
  categoria_id INTEGER NOT NULL REFERENCES categorias (id) ON DELETE RESTRICT,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

-- No Supabase as tabelas do schema public ficam expostas pela API pública deles.
-- Com RLS ligado e sem nenhuma policy, só a nossa API (que conecta como dona das tabelas) acessa.
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pratos ENABLE ROW LEVEL SECURITY;
