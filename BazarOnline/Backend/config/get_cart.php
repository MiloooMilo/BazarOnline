<?php
session_start();

// Überprüfen, ob der Warenkorb existiert
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Warenkorb-Daten als JSON zurückgeben
echo json_encode([
    'success' => true,
    'cart' => array_values($_SESSION['cart'])
]);
?>
