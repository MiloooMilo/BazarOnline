<?php
class LoginLogic
{
    private $db;

    public function __construct()
    {
        // Verwenden Sie die Methode connectToDatabase, um eine Verbindung zur Datenbank herzustellen
        $this->db = $this->connectToDatabase();
        if (!$this->db) {
            die("Verbindung zur Datenbank fehlgeschlagen.");
        }
    }

    private function connectToDatabase()
    {
        // Ersetzen Sie diese Werte mit Ihren echten Datenbankverbindungsinformationen
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "abidas";

        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            return false;
        }
        return $conn;
    }

    public function authenticate($login, $password)
    {
        if (!$this->db) {
            return false; // Keine Datenbankverbindung
        }

        $stmt = $this->db->prepare("SELECT * FROM user WHERE username = ? OR email = ?");
        if (!$stmt) {
            error_log('MySQL prepare error: ' . $this->db->error);
            return false; // Fehler beim Vorbereiten des Statements
        }

        $stmt->bind_param("ss", $login, $login);
        if (!$stmt->execute()) {
            error_log('Execute error: ' . $stmt->error);
            return false; // Fehler bei der Ausführung
        }

        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user && password_verify($password, $user['passwort'])) {
            return $user;  // Authentifizierung erfolgreich
        }

        return false;  // Benutzer nicht gefunden oder Passwort falsch
    }


    public function __destruct()
    {
        if ($this->db) {
            $this->db->close();  // Schließen Sie die Datenbankverbindung, falls vorhanden
        }
    }
}
