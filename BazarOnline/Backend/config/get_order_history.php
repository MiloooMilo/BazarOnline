<?php
require_once("../config/dbaccess.php");
session_start();

header('Content-Type: application/json');

// Debugging: Session-Daten ausgeben
error_log("Session-Daten: " . print_r($_SESSION, true)); // Schreibt die Session-Daten in das PHP-Fehlerprotokoll

// Überprüfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
    echo json_encode(['success' => false, 'message' => 'Nicht eingeloggt.']);
    exit;
}

// Benutzer-ID aus der Session erhalten
$user_id = $_SESSION['user_id'] ?? null;

if ($user_id === null) {
    echo json_encode(['success' => false, 'message' => 'Benutzer-ID nicht in der Session gefunden.']);
    exit;
}

try {
    // SQL-Abfrage, um die Bestellungen des Benutzers abzurufen
    $sql = "
        SELECT 
            o.id as order_id,
            o.datum as order_date,
            o.preis as total_amount,
            o.status,
            oi.id as order_item_id,
            oi.product_id,
            p.name as product_name,
            oi.quantity,
            oi.price
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN product p ON oi.product_id = p.id
        WHERE o.userid = ?
        ORDER BY o.datum DESC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $order_id = $row['order_id'];

        // Falls die Bestellung noch nicht im Ergebnis-Array ist, füge sie hinzu
        if (!isset($orders[$order_id])) {
            $orders[$order_id] = [
                'order_id' => $row['order_id'],
                'order_date' => $row['order_date'],
                'total_amount' => $row['total_amount'],
                'status' => $row['status'],
                'items' => []
            ];
        }

        // Füge das Produkt zur Bestellung hinzu
        $orders[$order_id]['items'][] = [
            'order_item_id' => $row['order_item_id'],
            'product_id' => $row['product_id'],
            'product_name' => $row['product_name'],
            'quantity' => $row['quantity'],
            'price' => $row['price']
        ];
    }

    // Bereite die Antwort vor
    $response = [
        'success' => true,
        'orders' => array_values($orders) // Konvertiere das assoziative Array in ein numerisches Array
    ];

    echo json_encode($response);
} catch (Exception $e) {
    // Fehlerbehandlung
    echo json_encode(['success' => false, 'message' => 'Fehler beim Abrufen der Bestellhistorie.', 'error' => $e->getMessage()]);
    exit;
}

$stmt->close();
$conn->close();
