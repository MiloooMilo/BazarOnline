<?php
$host = "localhost";
$db_user = "Milo";
$db_password = "Milorad02";
$dbname = "basaronline";

$conn = new mysqli($host, $db_user, $db_password, $dbname);

if ($conn->connect_error) {
  die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
}
?>