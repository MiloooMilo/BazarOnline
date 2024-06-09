<?php
session_start();

$productId = $_POST['productId'];

if (isset($_SESSION['cart'][$productId])) {
    if ($_SESSION['cart'][$productId]['quantity'] > 1) {
        $_SESSION['cart'][$productId]['quantity'] -= 1;
    } else {
        unset($_SESSION['cart'][$productId]);
    }
}

echo json_encode($_SESSION['cart']);
?>
