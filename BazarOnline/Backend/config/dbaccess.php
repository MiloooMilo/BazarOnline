<?php
$host = "localhost";
$db_user = "wi22b059";
$db_password = "Galatasaray2002";
$dbname = "basaronline";

$conn = new mysqli($host, $db_user, $db_password, $dbname);

if ($conn->connect_error) {
  die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
}
?>