<?php
session_start();
require_once("dbaccess.php");

$sql = "SELECT * FROM product";
$result = $conn->query($sql);

$products = [];
if ($result->num_rows > 0) {
    // Ausgabe der Daten jedes Reihen
    while($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
    echo json_encode($products);
} else {
    echo "0 results";
}
$conn->close();
?>