<?php
require_once("dbaccess.php");
session_start();

$category = isset($_GET['category']) ? $_GET['category'] : '';

$sql = "SELECT * FROM product";
if (!empty($category) && $category !== 'all') {
    $sql .= " WHERE category = '" . $conn->real_escape_string($category) . "'";
}

$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
} else {
    echo json_encode([]);
}
$conn->close();
?>