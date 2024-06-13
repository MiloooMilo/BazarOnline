<?php
session_start();

// Überprüfen, ob der Warenkorb existiert, andernfalls erstellen
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Überprüfen, ob die POST-Daten vorhanden sind
if (!isset($_POST['product'])) {
    echo json_encode(['success' => false, 'message' => 'Produktdaten fehlen.']);
    exit;
}

// Die Produktdaten aus den POST-Daten auslesen
$product = json_decode($_POST['product'], true);
if ($product === null) {
    echo json_encode(['success' => false, 'message' => 'Ungültige Produktdaten.']);
    exit;
}

$productId = $product['id'];

// Produkt in den Warenkorb hinzufügen oder die Menge erhöhen
if (isset($_SESSION['cart'][$productId])) {
    $_SESSION['cart'][$productId]['quantity'] += 1;
} else {
    $product['quantity'] = 1;
    $_SESSION['cart'][$productId] = $product;
}

// Erfolgsantwort zurückgeben
echo json_encode(['success' => true, 'cart' => $_SESSION['cart']]);
?>
