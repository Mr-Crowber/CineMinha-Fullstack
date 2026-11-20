-- CineMinha - banco de dados compartilhado pelo site, app e dashboard.
-- Pode ser executado novamente sem apagar dados existentes.

CREATE DATABASE IF NOT EXISTS cinema
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cinema;

CREATE TABLE IF NOT EXISTS filmes (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  duration VARCHAR(30) NOT NULL,
  rating VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  poster TEXT NULL,
  hero_image TEXT NULL,
  hero_title VARCHAR(150) NOT NULL DEFAULT '',
  hero_accent VARCHAR(150) NOT NULL DEFAULT '',
  `year` INT NULL,
  director VARCHAR(150) NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Rascunho',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_filmes_publicacao (status, featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE filmes ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS salas (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  capacidade INT NOT NULL DEFAULT 120,
  status VARCHAR(20) NOT NULL DEFAULT 'Ativa',
  formato VARCHAR(100) NOT NULL DEFAULT '2D / 3D',
  som VARCHAR(100) NOT NULL DEFAULT 'Dolby Digital',
  PRIMARY KEY (id),
  UNIQUE KEY uq_salas_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessoes (
  id INT NOT NULL AUTO_INCREMENT,
  filme_id INT NOT NULL,
  data_sessao DATE NOT NULL,
  horario TIME NOT NULL,
  sala_id INT NOT NULL,
  formato VARCHAR(60) NOT NULL DEFAULT '2D · Dublado',
  valor_meia DECIMAL(10,2) NOT NULL DEFAULT 15.00,
  valor_inteira DECIMAL(10,2) NOT NULL DEFAULT 30.00,
  status VARCHAR(20) NOT NULL DEFAULT 'Programada',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sessao_horario_sala (data_sessao, horario, sala_id),
  KEY idx_sessoes_filme_data (filme_id, data_sessao),
  CONSTRAINT fk_sessoes_filme FOREIGN KEY (filme_id) REFERENCES filmes(id),
  CONSTRAINT fk_sessoes_sala FOREIGN KEY (sala_id) REFERENCES salas(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mantém os campos originais da tabela ingressos (assento/tipo/valor) e acrescenta
-- os dados necessários para agrupar uma compra e vinculá-la a uma sessão.
CREATE TABLE IF NOT EXISTS ingressos (
  id INT NOT NULL AUTO_INCREMENT,
  filme_id INT NOT NULL,
  nome_cliente VARCHAR(100) NOT NULL,
  data_sessao DATE NOT NULL,
  horario TIME NOT NULL,
  sala INT NOT NULL,
  assento VARCHAR(5) NOT NULL,
  tipo_ingresso VARCHAR(20) NOT NULL,
  valor_unitario DECIMAL(10,2) NOT NULL,
  pedido_id CHAR(36) NULL,
  sessao_id INT NULL,
  forma_pagamento VARCHAR(40) NOT NULL DEFAULT 'Não informado',
  status VARCHAR(20) NOT NULL DEFAULT 'Confirmado',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ingressos_filme (filme_id),
  KEY idx_ingressos_pedido (pedido_id),
  KEY idx_ingressos_sessao (sessao_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE ingressos ENGINE=InnoDB;

-- MySQL não oferece ADD COLUMN IF NOT EXISTS na sintaxe do ALTER TABLE.
-- A procedure consulta INFORMATION_SCHEMA para tornar a migração repetível.
DROP PROCEDURE IF EXISTS cineMinhaMigrateColumns;
DELIMITER $$
CREATE PROCEDURE cineMinhaMigrateColumns()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'year') THEN
    ALTER TABLE filmes ADD COLUMN `year` INT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'director') THEN
    ALTER TABLE filmes ADD COLUMN director VARCHAR(150) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'hero_title') THEN
    ALTER TABLE filmes ADD COLUMN hero_title VARCHAR(150) NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'hero_accent') THEN
    ALTER TABLE filmes ADD COLUMN hero_accent VARCHAR(150) NOT NULL DEFAULT '';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'status') THEN
    ALTER TABLE filmes ADD COLUMN status VARCHAR(30) NOT NULL DEFAULT 'Rascunho';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'filmes' AND column_name = 'featured') THEN
    ALTER TABLE filmes ADD COLUMN featured TINYINT(1) NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'assento') THEN
    ALTER TABLE ingressos ADD COLUMN assento VARCHAR(5) NOT NULL DEFAULT 'A1';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'tipo_ingresso') THEN
    ALTER TABLE ingressos ADD COLUMN tipo_ingresso VARCHAR(20) NOT NULL DEFAULT 'Inteira';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'valor_unitario') THEN
    ALTER TABLE ingressos ADD COLUMN valor_unitario DECIMAL(10,2) NOT NULL DEFAULT 30.00;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'pedido_id') THEN
    ALTER TABLE ingressos ADD COLUMN pedido_id CHAR(36) NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'sessao_id') THEN
    ALTER TABLE ingressos ADD COLUMN sessao_id INT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'forma_pagamento') THEN
    ALTER TABLE ingressos ADD COLUMN forma_pagamento VARCHAR(40) NOT NULL DEFAULT 'Não informado';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'status') THEN
    ALTER TABLE ingressos ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'Confirmado';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'ingressos' AND column_name = 'created_at') THEN
    ALTER TABLE ingressos ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END$$
DELIMITER ;
CALL cineMinhaMigrateColumns();
DROP PROCEDURE cineMinhaMigrateColumns;

-- Índice único para impedir duas compras do mesmo assento na mesma sessão.
DROP PROCEDURE IF EXISTS cineMinhaAddSeatIndex;
DELIMITER $$
CREATE PROCEDURE cineMinhaAddSeatIndex()
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'ingressos'
      AND index_name = 'uq_ingresso_sessao_assento'
  ) THEN
    ALTER TABLE ingressos
      ADD UNIQUE KEY uq_ingresso_sessao_assento (sessao_id, assento);
  END IF;
END$$
DELIMITER ;
CALL cineMinhaAddSeatIndex();
DROP PROCEDURE cineMinhaAddSeatIndex;

INSERT INTO salas (id, nome, capacidade, status, formato, som) VALUES
  (1, 'Sala 01', 120, 'Ativa', '2D / 3D', 'Dolby Digital'),
  (2, 'Sala 02', 120, 'Ativa', '2D / 3D', 'Dolby Atmos'),
  (3, 'Sala 03', 100, 'Ativa', '2D', 'Dolby Digital'),
  (4, 'Sala 04', 160, 'Ativa', '2D / 3D', 'Dolby Atmos')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

-- O catálogo inicial é inserido pelo arquivo cinema-seed.sql opcional.
