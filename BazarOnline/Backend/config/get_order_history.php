<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

// Überprüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
    exit;
}

// Benutzer-ID aus der Session erhalten
$user_id = $_SESSION['user_id'];
$sql = "SELECT id AS order_id, datum AS order_date, preis AS total_amount, status
        FROM orders
        WHERE userid = ?
        ORDER BY datum DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $user_id);

// Execute the query and process the results
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'order_id' => $row['order_id'],
            'order_date' => $row['order_date'],
            'total_amount' => $row['total_amount'],
            'status' => $row['status']
        ];
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error fetching order history: ' . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
