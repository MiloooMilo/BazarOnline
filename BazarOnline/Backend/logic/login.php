<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // JSON-Daten auslesen
    $data = $_POST;

    $username_email = $data['username_email'];
    $passwort = $data['passwort'];

    // Überprüfung, ob die Eingaben leer sind
    if (empty($username_email) || empty($passwort)) {
        echo json_encode(['success' => false, 'message' => 'Bitte füllen Sie alle Felder aus.']);
        exit;
    }

    // SQL-Abfrage vorbereiten
    if (filter_var($username_email, FILTER_VALIDATE_EMAIL)) {
        // E-Mail-Adresse
        $sql = "SELECT * FROM user WHERE email = ?";
    } else {
        // Benutzername
        $sql = "SELECT * FROM user WHERE username = ?";
    }

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username_email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Überprüfen des Passworts
        if (password_verify($passwort, $user['passwort'])) {
            // Erfolgreicher Login
            $_SESSION['loggedin'] = true;
            $_SESSION['username'] = $user['username'];

            // Erfolgsantwort mit Benutzerdaten zurückgeben
            echo json_encode([
                'success' => true,
                'message' => 'Erfolgreich eingeloggt!',
                'user' => [
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'anrede' => $user['anrede'],
                    'vorname' => $user['vorname'],
                    'nachname' => $user['nachname']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Ungültiges Passwort']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Benutzername oder E-Mail-Adresse nicht gefunden']);
    }

    $stmt->close();
    $conn->close();
}
?>
