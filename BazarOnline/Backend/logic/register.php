<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

// Überprüfen, ob die Anfrage eine POST-Anfrage ist
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Debugging: Rohdaten auslesen
    $rawData = file_get_contents('php://input');
    error_log("Rohdaten: " . $rawData); // Ausgabe der Rohdaten im PHP-Error-Log

    // JSON-Daten auslesen
    $data = json_decode($rawData, true);

    // Sicherstellen, dass $data nicht null ist
    if ($data === null) {
        echo json_encode(['success' => false, 'message' => 'Ungültige JSON-Daten.']);
        exit;
    }

    // Variablen aus dem $data Array extrahieren
    $anrede = isset($data['anrede']) ? trim($data['anrede']) : null;
    $vorname = isset($data['vorname']) ? trim($data['vorname']) : null;
    $nachname = isset($data['nachname']) ? trim($data['nachname']) : null;
    $adresse = isset($data['adresse']) ? trim($data['adresse']) : null;
    $plz = isset($data['plz']) ? trim($data['plz']) : null;
    $ort = isset($data['ort']) ? trim($data['ort']) : null;
    $email = isset($data['email']) ? trim($data['email']) : null;
    $username = isset($data['username']) ? trim($data['username']) : null;
    $passwort = isset($data['passwort']) ? $data['passwort'] : null;
    $zahlungsinformation = isset($data['zahlungsinformation']) ? trim($data['zahlungsinformation']) : null;

    // Validierung der Eingabefelder
    if (empty($anrede) || empty($vorname) || empty($nachname) || empty($adresse) || empty($plz) || empty($ort) || empty($email) || empty($username) || empty($passwort)) {
        echo json_encode(['success' => false, 'message' => 'Alle markierten Felder müssen ausgefüllt sein.']);
        exit;
    }

    // Validierung der E-Mail-Adresse
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Ungültige E-Mail-Adresse.']);
        exit;
    }

    // Validierung des Benutzernamens (mindestens 3 Zeichen, maximal 20 Zeichen, nur alphanumerisch)
    if (!preg_match('/^[a-zA-Z0-9]{3,20}$/', $username)) {
        echo json_encode(['success' => false, 'message' => 'Der Benutzername muss zwischen 3 und 20 Zeichen lang sein und darf nur Buchstaben und Zahlen enthalten.']);
        exit;
    }

    // Überprüfen, ob der Benutzername oder die E-Mail-Adresse bereits existiert
    $sql = "SELECT * FROM user WHERE username = ? OR email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Der Benutzername oder die E-Mail-Adresse ist bereits vergeben.']);
        exit;
    }

    // Passwort verschlüsseln
    $hashedPassword = password_hash($passwort, PASSWORD_DEFAULT);

    // Einfügen der Benutzerdaten in die Datenbank
    $insertSql = "INSERT INTO user (anrede, vorname, nachname, adresse, plz, ort, email, username, passwort, zahlungsinformation, rolle) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user')";
    $stmt = $conn->prepare($insertSql);
    $stmt->bind_param("ssssisssss", $anrede, $vorname, $nachname, $adresse, $plz, $ort, $email, $username, $hashedPassword, $zahlungsinformation);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Registrierung erfolgreich!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler bei der Registrierung: ' . $conn->error]);
    }

    // Verbindung schließen
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfragemethode.']);
}
?>
