<?php
require_once 'php/config.php';

$params = [
    'client_id'     => GOOGLE_CLIENT_ID,
    'redirect_uri'  => GOOGLE_REDIRECT_URI,
    'response_type' => 'code',
    'scope'         => 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    'access_type'   => 'offline',
    'prompt'        => 'consent'
];

$login_url = GOOGLE_AUTH_URL . '?' . http_build_query($params);
?>

<!DOCTYPE html>
<html lang="pt">
<head>
    <title>Login OAuth 2.0 - Google</title>
</head>
<body>
    <h2>Projeto 1 - Autenticação Google</h2>
    <a href="<?php echo $login_url; ?>" style="padding:10px; background:#4285F4; color:white; text-decoration:none; border-radius:5px;">
        Entrar com Google
    </a>
</body>
</html>