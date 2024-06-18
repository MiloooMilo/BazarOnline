<?php
require_once("../config/dbaccess.php");
session_start();
header('Content-Type: application/json');

// Function to get product details
function getProduct($id) {
    global $conn;
    $stmt = $conn->prepare("SELECT * FROM product WHERE id = ?");
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Preparation failed: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        echo json_encode($product);
    } else {
        echo json_encode(['success' => false, 'message' => 'Product not found']);
    }
    $stmt->close();
}

// Function to edit a product
function editProduct($id, $name, $description, $rating, $price, $imageUrl, $category) {
    global $conn;
    $sql = "UPDATE product SET name=?, description=?, rating=?, price=?, url=?, category=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssidssi", $name, $description, $rating, $price, $imageUrl, $category, $id);
    return $stmt->execute();
}

// Handle the request
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $id = $_GET['id'] ?? 0;
    getProduct($id);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['product-id'] ?? 0;
    $name = $_POST['product-name'] ?? '';
    $description = $_POST['product-description'] ?? '';
    $rating = $_POST['product-rating'] ?? 0;
    $price = $_POST['product-price'] ?? 0;
    $imageUrl = $_POST['product-image-url'] ?? '';
    $category = $_POST['product-category'] ?? '';

    if (editProduct($id, $name, $description, $rating, $price, $imageUrl, $category)) {
        echo json_encode(['success' => true, 'message' => 'Produkt erfolgreich bearbeitet.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Bearbeiten des Produkts.']);
    }
    exit;
}
?>
