<?php
// =========================================================
// Configuração de conexão com o banco (ajuste conforme seu ambiente)
// Se você usa XAMPP/WAMP local, esses valores padrão costumam funcionar.
// =========================================================

$DB_HOST = 'localhost';
$DB_NAME = 'projeto_equipe';
$DB_USER = 'root';
$DB_PASS = ''; // no XAMPP padrão, a senha do root costuma ser vazia

try {
    $pdo = new PDO(
        "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die('Erro ao conectar no banco: ' . htmlspecialchars($e->getMessage()));
}
