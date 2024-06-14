<?php
session_start();
session_unset();
session_destroy();
header("Location: login.html"); // Leite den Benutzer zur Login-Seite weiter
exit;
?>
