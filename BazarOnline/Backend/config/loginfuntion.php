<?php
header('Content-Type: application/json');
session_start();
require_once 'loginlogic.php';

// Sicherstellen, dass die nötigen Daten vorhanden sind
if (!isset($_POST['email'], $_POST['password'])) {
    $response = ['success' => false, 'message' => 'Benutzername/E-Mail und Passwort müssen angegeben werden.'];
    echo json_encode($response);
    exit;
}

$login = $_POST['email']; // Dieses Feld nimmt nun sowohl Benutzernamen als auch E-Mail auf
$password = $_POST['password'];
$rememberMe = isset($_POST['rememberMe']) ? true : false;

$loginLogic = new LoginLogic();
$user = $loginLogic->authenticate($login, $password);

if ($user) {
    // Session und Cookie einrichten, wenn gewünscht
    $_SESSION['user_id'] = $user['UserID'];  // Benutzeridentifikation
    $_SESSION['role'] = $user['role'];
    $_SESSION['role'] = $user['role'];

    if ($rememberMe) {
        setcookie('user_id', $user['UserID'], time() + 86400 * 30, "/", "", true, true); // Sicheres Cookie
    }
    $response = ['success' => true, 'message' => 'Login erfolgreich.'];
} else {
    $response = ['success' => false, 'message' => 'Login fehlgeschlagen. Überprüfen Sie die Eingaben.'];
}


echo json_encode($response);
