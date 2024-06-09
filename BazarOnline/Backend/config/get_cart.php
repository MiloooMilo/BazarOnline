<?php
session_start();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

echo json_encode(array_values($_SESSION['cart']));
?>
