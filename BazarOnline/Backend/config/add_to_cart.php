<?php
session_start();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$product = $_POST['product'];
$productId = $product['id'];

if (isset($_SESSION['cart'][$productId])) {
    $_SESSION['cart'][$productId]['quantity'] += 1;
} else {
    $product['quantity'] = 1;
    $_SESSION['cart'][$productId] = $product;
}

echo json_encode($_SESSION['cart']);
?>
