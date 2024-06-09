<?php
require_once("../config/dbaccess.php");
header('Content-Type: application/json');
session_start();

if ($_SERVER["REQUEST_METHOD"] == 'POST') {
    // JSON-Daten einlesen
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Ungültige Daten erhalten.']);
        exit;
    }

    // Debug-Ausgabe zur Überprüfung der empfangenen Daten
    error_log("Empfangene Daten: " . print_r($data, true));

    // Daten aus dem JSON extrahieren
    $anrede = $data['anrede'] ?? '';
    $vorname = $data['vorname'] ?? '';
    $nachname = $data['nachname'] ?? '';
    $adresse = $data['adresse'] ?? '';
    $plz = $data['plz'] ?? '';
    $ort = $data['ort'] ?? '';
    $email = $data['email'] ?? '';
    $username = mysqli_real_escape_string($conn, $data['username'] ?? '');
    $passwort = $data['passwort'] ?? '';
    $zahlungsinformation = $data['zahlungsinformation'] ?? '';
    $rolle = 'user';

    // Validierungen
    if (empty($anrede) || empty($vorname) || empty($nachname) || empty($adresse) || empty($plz) || empty($ort) || empty($email) || empty($username) || empty($passwort) || empty($zahlungsinformation)) {
        echo json_encode(['success' => false, 'message' => 'Alle Felder müssen ausgefüllt sein.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Ungültige E-Mail-Adresse.']);
        exit;
    }

    // Überprüfen, ob der Benutzername bereits existiert
    $sql = "SELECT * FROM user WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Der Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.']);
        exit;
    }

    // Passwort verschlüsseln
    $hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);

    // Einfügen der Benutzerdaten in die Datenbank
    $insertSql = "INSERT INTO user (anrede, vorname, nachname, adresse, plz, ort, email, username, passwort, zahlungsinformation, rolle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertSql);
    $stmt->bind_param("ssssissssss", $anrede, $vorname, $nachname, $adresse, $plz, $ort, $email, $username, $hashedPassword, $zahlungsinformation, $rolle);

    if ($stmt->execute()) {
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        echo json_encode(['success' => true, 'message' => 'Registrierung erfolgreich!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler bei der Registrierung: ' . $conn->error]);
    }

    $stmt->close();
}

$conn->close();
?>
