<?php

class JWTService {

    /* =========================
       SET SECURE COOKIES
    ========================= */

    public static function setAuthCookies(string $accessToken): void {
        setcookie(
            "access_token",
            $accessToken,
            [
                'expires' => time()  + 900,
                'path' => '/',
                'httponly' => true,
                'secure' => true,
                'samesite' => 'Strict'
            ]
        );
    }
}
