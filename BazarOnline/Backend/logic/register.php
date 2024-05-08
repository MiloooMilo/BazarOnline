<?php
require_once("../config/dbaccess.php");
session_start();

if ($_SERVER["REQUEST_METHOD"] == 'POST') {
    
    $anrede = $_POST['anrede'];
    $vorname = $_POST['vorname'];
    $nachname = $_POST['nachname'];
    $adresse = $_POST['adresse'];
    $plz = $_POST['plz'];
    $ort = $_POST['ort'];
    $email = $_POST['email'];
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $passwort = $_POST['passwort'];
    $rolle = 'user';
    $zahlungsinformation = $_POST['zahlungsinformation'];

    if (empty($anrede)) {
        die("Das Feld 'Anrede' muss ausgefüllt sein.");
    }
    if (empty($vorname)) {
        die("Das Feld 'Vorname' muss ausgefüllt sein.");
    }
    if (empty($nachname)) {
        die("Das Feld 'Nachname' muss ausgefüllt sein.");
    }
    if (empty($adresse)) {
        die("Das Feld 'Adresse' muss ausgefüllt sein.");
    }
    if (empty($plz)) {
        die("Das Feld 'PLZ' muss ausgefüllt sein.");
    }
    if (empty($ort)) {
        die("Das Feld 'Ort' muss ausgefüllt sein.");
    }
    if (empty($email)) {
        die("Das Feld 'E-Mail' muss ausgefüllt sein.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Ungültige E-Mail-Adresse.");
    }
    if (empty($username)) {
        die("Das Feld 'Benutzername' muss ausgefüllt sein.");
    }
    if (empty($passwort)) {
        die("Das Feld 'Passwort' muss ausgefüllt sein.");
    }
    if (empty($zahlungsinformation)) {
        die("Das Feld 'Zahlungsinformation' muss ausgefüllt sein.");
    }

    // Überprüfen, ob der Benutzername bereits existiert
    $sql = "SELECT * FROM user WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        die("Der Benutzername ist bereits vergeben. Bitte wählen Sie einen anderen.");
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
        header("location: login.php"); // Pfad zur Login-Seite
        exit;
    } else {
        echo "Fehler bei der Registrierung: " . $conn->error;
    }

    $stmt->close();
}

$conn->close();
?>
