<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

// Function to handle JSON response
function jsonResponse($success, $message, $user = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($user) {
        $response['user'] = $user;
    }
    echo json_encode($response);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['username_email'], $data['passwort'])) {
        jsonResponse(false, 'Bitte füllen Sie alle Felder aus.');
    }

    $username_email = $data['username_email'];
    $passwort = $data['passwort'];
    $remember_me = $data['remember_me'] ?? false;

    if (filter_var($username_email, FILTER_VALIDATE_EMAIL)) {
        $sql = "SELECT * FROM user WHERE email = ?";
    } else {
        $sql = "SELECT * FROM user WHERE username = ?";
    }

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        jsonResponse(false, 'Preparation failed: ' . $conn->error);
    }
    
    $stmt->bind_param("s", $username_email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        if ($user['active'] == 0) {
            jsonResponse(false, 'Ihr Konto ist deaktiviert. Bitte kontaktieren Sie admin@bazaronline.at für weitere Informationen.');
        }
    
        if (password_verify($passwort, $user['passwort'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $user['username'];
            $_SESSION['user_id'] = $user['id'];

            if ($remember_me) {
                setcookie("username_email", $username_email, time() + (86400 * 30), "/"); // 30 days
                setcookie("passwort", $passwort, time() + (86400 * 30), "/"); // 30 days
            } else {
                setcookie("username_email", "", time() - 3600, "/");
                setcookie("passwort", "", time() - 3600, "/");
            }

            jsonResponse(true, 'Erfolgreich eingeloggt!', [
                'username' => $user['username'],
                'email' => $user['email'],
                'anrede' => $user['anrede'],
                'vorname' => $user['vorname'],
                'nachname' => $user['nachname'],
                'rolle' => $user['rolle']
            ]);
        } else {
            jsonResponse(false, 'Ungültiges Passwort');
        }
    } else {
        jsonResponse(false, 'Benutzername oder E-Mail-Adresse nicht gefunden');
    }

    $stmt->close();
    $conn->close();
}
?>
