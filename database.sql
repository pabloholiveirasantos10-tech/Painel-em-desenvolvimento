-- =========================================================
-- Script de criação do banco para o Painel de Teste
-- Como usar no HeidiSQL:
-- 1. Conecte no seu servidor MySQL/MariaDB local
-- 2. Abra uma aba de consulta (Query) com Ctrl+Q
-- 3. Cole todo este conteúdo e rode com F9 (executa tudo)
-- =========================================================

CREATE DATABASE IF NOT EXISTS projeto_equipe
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE projeto_equipe;

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT NULL,
    responsavel ENUM('Pablo', 'Gabriela') NOT NULL DEFAULT 'Pablo',
    status ENUM('A Fazer', 'Em Andamento', 'Concluído') NOT NULL DEFAULT 'A Fazer',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Alguns registros de exemplo, só para o painel não abrir vazio
INSERT INTO tarefas (titulo, descricao, responsavel, status) VALUES
('Configurar proteção da branch master', 'Garantir PR obrigatório e aprovação', 'Pablo', 'Concluído'),
('Revisar layout da tela de login', 'Ajustar espaçamento e cores', 'Gabriela', 'Em Andamento'),
('Testar fluxo completo de merge', 'Validar aprovação e bloqueio de push direto', 'Pablo', 'A Fazer');
