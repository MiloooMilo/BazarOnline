<?php
require_once("../config/dbaccess.php");
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username_email = $_POST['username_email'];
    $passwort = $_POST['passwort'];

    // Vorbereitetes Statement, um SQL-Injection zu vermeiden
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
            header("location: success_page.php"); // Leite zu einer Erfolgsseite weiter
            exit;
        } else {
            echo "Ungültiges Passwort";
        }
    } else {
        echo "Benutzername oder E-Mail-Adresse nicht gefunden";
    }

    $stmt->close();
    $conn->close();
}
?>
