const clientId = "Off535kkhfjd54584hdjf";
const redirectUri = "https://a407-2a0d-3341-fc41-5f10-7daa-3cce-d1fb-f7b6.ngrok-free.app/gitoauthapp/php/callback.php";

document.getElementById("login").onclick = () => {

const authUrl =
"https://github.com/login/oauth/authorize" +
"?client_id=" + clientId +
"&redirect_uri=" + redirectUri +
"&scope=user";

window.location.href = authUrl;

};
