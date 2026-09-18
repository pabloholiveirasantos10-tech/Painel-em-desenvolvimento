<?php
// =========================================================
// api.php — back-end do painel. Recebe requisições do script.js
// e responde em JSON. O front-end (index.html) nunca fala com o
// banco diretamente, só através deste arquivo.
// =========================================================

require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

$acao = $_REQUEST['acao'] ?? '';

switch ($acao) {

    // -----------------------------------------------------
    // Listar tarefas (com filtro opcional por responsável)
    // -----------------------------------------------------
    case 'listar':
        $filtro = $_GET['responsavel'] ?? 'Todos';

        if ($filtro === 'Todos') {
            $tarefas = $pdo->query('SELECT * FROM tarefas ORDER BY criado_em DESC')->fetchAll();
        } else {
            $stmt = $pdo->prepare('SELECT * FROM tarefas WHERE responsavel = ? ORDER BY criado_em DESC');
            $stmt->execute([$filtro]);
            $tarefas = $stmt->fetchAll();
        }

        echo json_encode([
            'ok' => true,
            'tarefas' => $tarefas,
        ]);
        break;

    // -----------------------------------------------------
    // Criar tarefa
    // -----------------------------------------------------
    case 'criar':
        $titulo = trim($_POST['titulo'] ?? '');

        if ($titulo === '') {
            http_response_code(422);
            echo json_encode(['ok' => false, 'erro' => 'Título é obrigatório.']);
            break;
        }

        $stmt = $pdo->prepare(
            'INSERT INTO tarefas (titulo, descricao, responsavel, status) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $titulo,
            trim($_POST['descricao'] ?? ''),
            $_POST['responsavel'] ?? 'Pablo',
            $_POST['status'] ?? 'A Fazer',
        ]);

        echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
        break;

    // -----------------------------------------------------
    // Atualizar status
    // -----------------------------------------------------
    case 'atualizar_status':
        $id = (int) ($_POST['id'] ?? 0);
        $status = $_POST['status'] ?? '';

        $stmt = $pdo->prepare('UPDATE tarefas SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);

        echo json_encode(['ok' => true]);
        break;

    // -----------------------------------------------------
    // Excluir tarefa
    // -----------------------------------------------------
    case 'excluir':
        $id = (int) ($_POST['id'] ?? 0);

        $stmt = $pdo->prepare('DELETE FROM tarefas WHERE id = ?');
        $stmt->execute([$id]);

        echo json_encode(['ok' => true]);
        break;

    default:
        http_response_code(400);
        echo json_encode(['ok' => false, 'erro' => 'Ação inválida.']);
}
