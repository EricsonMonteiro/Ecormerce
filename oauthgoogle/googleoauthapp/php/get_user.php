<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['access_token'])) {
    header("Location: ../index.php");
    exit();
}

$access_token = $_SESSION['access_token'];

// Faz a chamada à API do Google para obter dados do utilizador
$ch = curl_init(GOOGLE_USERINFO_URL);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $access_token"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$user_info = json_decode(curl_exec($ch), true);
curl_close($ch);

echo "<h1>Sucesso!</h1>";
echo "<h3>O teu Access Token (usa isto no terminal):</h3>";
echo "<code style='background:#eee; padding:10px; display:block; word-break:break-all;'>$access_token</code>";

echo "<h3>Dados do Utilizador:</h3>";
echo "<pre>"; print_r($user_info); echo "</pre>";
?>