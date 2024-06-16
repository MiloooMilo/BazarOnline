<?php
session_start();

// Empfange und dekodiere die JSON-Daten
$input = json_decode(file_get_contents('php://input'), true);

$productId = $input['productId'];
$action = $input['action'];

if (isset($_SESSION['cart'][$productId])) {
    if ($action === 'decrease' && $_SESSION['cart'][$productId]['quantity'] > 1) {
        // Verringere die Menge
        $_SESSION['cart'][$productId]['quantity'] -= 1;
    } else {
        // Entferne das Produkt komplett
        unset($_SESSION['cart'][$productId]);
    }
}

// Rückgabe des aktualisierten Warenkorbs als JSON
echo json_encode(['cart' => array_values($_SESSION['cart'])]);
?>
