<?php
session_start();
require_once("dbaccess.php");

// Function to sanitize input data
function sanitize($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Check if the cart exists, if not, create it
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Check if the POST data exists
if (!isset($_POST['productId'])) {
    echo json_encode(['success' => false, 'message' => 'Produkt ID fehlt.']);
    exit;
}

// Sanitize and validate the product ID
$productId = sanitize($_POST['productId']);
if (!is_numeric($productId)) {
    echo json_encode(['success' => false, 'message' => 'Ungültige Produkt ID.']);
    exit;
}

// Fetch product details from the database
$sql = "SELECT * FROM product WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $productId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Produkt nicht gefunden.']);
    exit;
}

$product = $result->fetch_assoc();
$productName = sanitize($product['name']);
$productPrice = floatval($product['price']);
$productUrl = filter_var($product['url'], FILTER_SANITIZE_URL);

// Prepare the product array for the cart
$productArray = [
    'id' => $productId,
    'name' => $productName,
    'price' => $productPrice,
    'url' => $productUrl,
    'quantity' => 1
];

// Add product to the cart or update the quantity if it already exists
if (isset($_SESSION['cart'][$productId])) {
    $_SESSION['cart'][$productId]['quantity'] += 1;
} else {
    $_SESSION['cart'][$productId] = $productArray;
}

// Successful response with updated cart
echo json_encode([
    'success' => true,
    'message' => 'Produkt erfolgreich zum Warenkorb hinzugefügt.',
    'cart' => $_SESSION['cart']
]);

$stmt->close();
$conn->close();
?>
