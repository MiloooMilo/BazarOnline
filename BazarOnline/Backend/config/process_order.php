<?php
session_start();
require 'dbaccess.php'; // Datei für die Datenbankverbindung

header('Content-Type: application/json'); // JSON-Header hinzufügen

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cart = json_decode($_POST['cart'], true);
    $paymentMethod = $_POST['paymentMethod'];
    $voucherCode = $_POST['voucherCode'];
    $totalPrice = $_POST['totalPrice'];

    if (empty($cart) || empty($paymentMethod)) {
        echo json_encode(['success' => false, 'error' => 'Unvollständige Bestelldaten']);
        exit;
    }

    $voucherValue = 0; // Initialer Wert für den Gutschein

    // Überprüfen des Gutscheins
    if ($voucherCode) {
        $stmt = $conn->prepare("SELECT value, expiry_date, redeemed FROM coupon WHERE code = ? AND expiry_date >= NOW() AND redeemed = 0");
        if ($stmt === false) {
            echo json_encode(['success' => false, 'error' => $conn->error]);
            exit;
        }
        $stmt->bind_param('s', $voucherCode);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $coupon = $result->fetch_assoc();
            $voucherValue = $coupon['value'];
            $expiryDate = $coupon['expiry_date'];
            $isRedeemed = $coupon['redeemed'];
        } else {
            echo json_encode(['success' => false, 'error' => 'Ungültiger, abgelaufener oder bereits eingelöster Gutscheincode']);
            exit;
        }
    }

    // Berechnung des zu zahlenden Betrags
    $amountToPay = $totalPrice;
    $remainingVoucherValue = $voucherValue;

    if ($voucherValue > 0) {
        if ($voucherValue >= $totalPrice) {
            $amountToPay = 0; // Gutschein deckt den gesamten Betrag
            $remainingVoucherValue = $voucherValue - $totalPrice; // Restwert des Gutscheins
        } else {
            $amountToPay = $totalPrice - $voucherValue; // Teilweise Abdeckung des Gesamtbetrags
            $remainingVoucherValue = 0; // Gutschein vollständig eingelöst
        }
    }

    try {
        $conn->begin_transaction();

        // Bestellung in der Tabelle `orders` speichern
        $stmt = $conn->prepare("INSERT INTO orders (datum, userid, preis, status) VALUES (NOW(), ?, ?, 'preparing')");
        if ($stmt === false) {
            throw new Exception($conn->error);
        }
        $stmt->bind_param('id', $_SESSION['user_id'], $amountToPay);
        if (!$stmt->execute()) {
            throw new Exception($stmt->error);
        }
        $orderId = $conn->insert_id;

        // Produkte in der Tabelle `order_product` speichern
        $stmt = $conn->prepare("INSERT INTO order_product (order_id, product_id, quantity) VALUES (?, ?, ?)");
        if ($stmt === false) {
            throw new Exception($conn->error);
        }

        foreach ($cart as $item) {
            $stmt->bind_param('iii', $orderId, $item['id'], $item['quantity']);
            if (!$stmt->execute()) {
                throw new Exception($stmt->error);
            }
        }

        // Wenn ein Gutschein verwendet wurde
        if ($voucherValue > 0) {
            if ($remainingVoucherValue > 0) {
                // Gutschein wurde nicht vollständig eingelöst, aktualisieren des Restwertes
                $stmt = $conn->prepare("UPDATE coupon SET value = ? WHERE code = ?");
                if ($stmt === false) {
                    throw new Exception($conn->error);
                }
                $stmt->bind_param('ds', $remainingVoucherValue, $voucherCode);
                if (!$stmt->execute()) {
                    throw new Exception($stmt->error);
                }
            } else {
                // Gutschein wurde vollständig eingelöst, setze redeemed auf true
                $stmt = $conn->prepare("UPDATE coupon SET value = 0, redeemed = 1 WHERE code = ?");
                if ($stmt === false) {
                    throw new Exception($conn->error);
                }
                $stmt->bind_param('s', $voucherCode);
                if (!$stmt->execute()) {
                    throw new Exception($stmt->error);
                }
            }
        }

        $conn->commit();
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        $conn->rollback();
        error_log("Bestellfehler: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}
?>
