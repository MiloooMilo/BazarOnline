<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    echo json_encode(['success' => false, 'message' => 'Nicht angemeldet.']);
    exit;
}

$user_id = $_SESSION['user_id'];

function getUserDetails($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT id, username, email, anrede, vorname, nachname, adresse, plz, ort FROM user WHERE id = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Preparation failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => true, 'user' => $result->fetch_assoc()]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
    $stmt->close();
}

function updateUser($id, $anrede, $vorname, $nachname, $adresse, $plz, $ort, $current_password) {
    global $conn;
    $stmt = $conn->prepare("SELECT passwort FROM user WHERE id = ?");
    if (!$stmt) {
        return ['success' => false, 'message' => 'Preparation failed: ' . $conn->error];
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 0) {
        return ['success' => false, 'message' => 'User not found'];
    }

    $user = $result->fetch_assoc();
    if (!password_verify($current_password, $user['passwort'])) {
        return ['success' => false, 'message' => 'Aktuelles Passwort ist falsch'];
    }

    $stmt = $conn->prepare("UPDATE user SET anrede=?, vorname=?, nachname=?, adresse=?, plz=?, ort=? WHERE id=?");
    if (!$stmt) {
        return ['success' => false, 'message' => 'Preparation failed: ' . $conn->error];
    }
    $stmt->bind_param("ssssssi", $anrede, $vorname, $nachname, $adresse, $plz, $ort, $id);
    if ($stmt->execute()) {
        return ['success' => true, 'message' => 'Profil erfolgreich bearbeitet'];
    } else {
        return ['success' => false, 'message' => 'Fehler beim Bearbeiten des Profils: ' . $stmt->error];
    }
    $stmt->close();
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    getUserDetails($user_id);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $anrede = $data['anrede'] ?? '';
    $vorname = $data['vorname'] ?? '';
    $nachname = $data['nachname'] ?? '';
    $adresse = $data['adresse'] ?? '';
    $plz = $data['plz'] ?? '';
    $ort = $data['ort'] ?? '';
    $current_password = $data['current_password'] ?? '';

    echo json_encode(updateUser($user_id, $anrede, $vorname, $nachname, $adresse, $plz, $ort, $current_password));
    exit;
}
?>
