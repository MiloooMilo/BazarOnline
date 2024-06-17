<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    $username_email = $data['username_email'];
    $passwort = $data['passwort'];

    if (empty($username_email) || empty($passwort)) {
        echo json_encode(['success' => false, 'message' => 'Bitte füllen Sie alle Felder aus.']);
        exit;
    }

    if (filter_var($username_email, FILTER_VALIDATE_EMAIL)) {
        $sql = "SELECT * FROM user WHERE email = ?";
    } else {
        $sql = "SELECT * FROM user WHERE username = ?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username_email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
    
        if (password_verify($passwort, $user['passwort'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $user['username'];
    
            // Überprüfen der abgerufenen Rolle
            echo json_encode([
                'success' => true,
                'message' => 'Erfolgreich eingeloggt!',
                'user' => [
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'anrede' => $user['anrede'],
                    'vorname' => $user['vorname'],
                    'nachname' => $user['nachname'],
                    'rolle' => $user['rolle'] // 'admin' oder 'user'
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ungültiges Passwort']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Benutzername oder E-Mail-Adresse nicht gefunden']);
    }
    
}
?>
