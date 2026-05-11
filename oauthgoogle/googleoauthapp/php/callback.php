<?php
session_start();
require_once 'config.php';

if (isset($_GET['code'])) {
    $code = $_GET['code'];

    // Preparar a requisição para trocar o código pelo token
    $ch = curl_init(GOOGLE_TOKEN_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
        'code'          => $code,
        'client_id'     => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'redirect_uri'  => GOOGLE_REDIRECT_URI,
        'grant_type'    => 'authorization_code'
    ]));

    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);

    if (isset($response['access_token'])) {
        $access_token = $response['access_token'];
        
        // Guardamos o token na sessão para usar depois na aula (com o curl)
        $_SESSION['access_token'] = $access_token;

        // Redireciona para o get_user.php para mostrar os dados
        header("Location: get_user.php");
        exit();
    } else {
        echo "Erro ao obter o token: " . print_r($response, true);
    }
} else {
    echo "Código de autorização não recebido.";
}