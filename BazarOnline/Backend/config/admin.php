<?php
require_once("../config/dbaccess.php");
session_start();

// Überprüfen, ob der Benutzer ein Admin ist


// Hilfsfunktionen für verschiedene Verwaltungsaufgaben

// Funktion zum Hinzufügen eines Produkts
function addProduct($name, $description, $rating, $price, $imageUrl, $category) {
    global $conn;
    $sql = "INSERT INTO product (name, description, rating, price, url, category) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssidss", $name, $description, $rating, $price, $imageUrl, $category);
    return $stmt->execute();
}

// Funktion zum Löschen eines Produkts
function deleteProduct($id) {
    global $conn;
    $sql = "DELETE FROM product WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}

// Funktion zum Deaktivieren eines Kunden
function deactivateCustomer($id) {
    global $conn;
    $sql = "UPDATE user SET active=0 WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}

function activateCustomer($id) {
    global $conn;
    $sql = "UPDATE user SET active=1 WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}

// Funktion zum Erstellen eines Gutscheins
function generateCoupon($value, $expiryDate) {
    global $conn;
    $code = substr(str_shuffle("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 5);
    $sql = "INSERT INTO coupon (code, value, expiry_date) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sis", $code, $value, $expiryDate);
    return $stmt->execute();
}

// Produkte anzeigen
$products = $conn->query("SELECT * FROM product")->fetch_all(MYSQLI_ASSOC);

// Kunden anzeigen
$customers = $conn->query("SELECT * FROM user WHERE rolle='user'")->fetch_all(MYSQLI_ASSOC);

// Gutscheine anzeigen
$coupons = $conn->query("SELECT * FROM coupon")->fetch_all(MYSQLI_ASSOC);

// Admin: Bestellungen anzeigen
function getCustomerOrders($customer_id) {
    global $conn;
    $sql = "SELECT id AS order_id, datum AS order_date, preis AS total_amount, status FROM orders WHERE userid = ? ORDER BY datum DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $customer_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }
    return $orders;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="../../Frontend/js/header.js"></script> <!-- Script für den Header -->

    <style>
        .container {
            margin-top: 20px;
        }
        .table th, .table td {
            vertical-align: middle;
        }
    </style>
</head>
<body>
<header class="header" id="header-site"></header>
    <div class="container">
        <h1>Admin Panel</h1>
        
        <!-- Produktverwaltung -->
        <section id="product-management">
            <h2>Produkte hinzufügen</h2>
            <!-- Bereich zum Hinzufügen von Produkten -->
            <form id="add-product-form" method="POST">
                <div class="mb-3">
                    <label for="product-name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="product-name" name="product-name" required>
                </div>
                <div class="mb-3">
                    <label for="product-description" class="form-label">Beschreibung</label>
                    <textarea class="form-control" id="product-description" name="product-description" required></textarea>
                </div>
                <div class="mb-3">
                    <label for="product-rating" class="form-label">Bewertung</label>
                    <input type="number" class="form-control" id="product-rating" name="product-rating" min="0" max="5" step="0.1" required>
                </div>
                <div class="mb-3">
                    <label for="product-price" class="form-label">Preis</label>
                    <input type="number" class="form-control" id="product-price" name="product-price" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label for="product-image-url" class="form-label">Bild-URL</label>
                    <input type="url" class="form-control" id="product-image-url" name="product-image-url" required>
                </div>
                <div class="mb-3">
                    <label for="product-category" class="form-label">Kategorie</label>
                    <input type="text" class="form-control" id="product-category" name="product-category" required>
                </div>
                <button type="submit" class="btn btn-primary">Produkt hinzufügen</button>
            </form>

            <h3>Existierende Produkte</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Beschreibung</th>
                        <th>Bewertung</th>
                        <th>Preis</th>
                        <th>Foto</th>
                        <th>Kategorie</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($product['name']); ?></td>
                        <td><?php echo htmlspecialchars($product['description']); ?></td>
                        <td><?php echo htmlspecialchars($product['rating']); ?></td>
                        <td><?php echo htmlspecialchars($product['price']); ?>€</td>
                        <td><img src="<?php echo htmlspecialchars($product['url']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" height="50"></td>
                        <td><?php echo htmlspecialchars($product['category']); ?></td>
                        <td>
                            <button class="btn btn-warning btn-sm" onclick="editProduct(<?php echo $product['id']; ?>)">Bearbeiten</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteProduct(<?php echo $product['id']; ?>)">Löschen</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>

        <!-- Kundenverwaltung -->
        <section id="customer-management">
            <h2>Kunden verwalten</h2>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Vorname</th>
                        <th>Nachname</th>
                        <th>Adresse</th>
                        <th>PLZ</th>
                        <th>Ort</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($customers as $customer): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($customer['username']); ?></td>
                        <td><?php echo htmlspecialchars($customer['email']); ?></td>
                        <td><?php echo htmlspecialchars($customer['vorname']); ?></td>
                        <td><?php echo htmlspecialchars($customer['nachname']); ?></td>
                        <td><?php echo htmlspecialchars($customer['adresse']); ?></td>
                        <td><?php echo htmlspecialchars($customer['plz']); ?></td>
                        <td><?php echo htmlspecialchars($customer['ort']); ?></td>
                        <td>
                            <button class="btn btn-info btn-sm" onclick="viewCustomerOrders(<?php echo $customer['id']; ?>)">Bestellungen ansehen</button>
                            <button class="btn btn-danger btn-sm" onclick="deactivateCustomer(<?php echo $customer['id']; ?>)">Deaktivieren</button>
                            <button class="btn btn-success btn-sm" onclick="activateCustomer(<?php echo $customer['id']; ?>)">Aktivieren</button>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>

        <!-- Gutscheine verwalten -->
        <section id="coupon-management">
            <h2>Gutscheine verwalten</h2>
            <form id="add-coupon-form" method="POST">
                <div class="mb-3">
                    <label for="coupon-value" class="form-label">Wert</label>
                    <input type="number" class="form-control" id="coupon-value" name="coupon-value" step="0.01" required>
                </div>
                <div class="mb-3">
                    <label for="coupon-expiry" class="form-label">Ablaufdatum</label>
                    <input type="date" class="form-control" id="coupon-expiry" name="coupon-expiry" required>
                </div>
                <button type="submit" class="btn btn-primary">Gutschein erstellen</button>
            </form>

            <h3>Existierende Gutscheine</h3>
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Wert</th>
                        <th>Ablaufdatum</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($coupons as $coupon): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($coupon['code']); ?></td>
                        <td><?php echo htmlspecialchars($coupon['value']); ?>€</td>
                        <td><?php echo htmlspecialchars($coupon['expiry_date']); ?></td>
                        <td>
                            <?php 
                                $status = "Aktiv";
                                if (new DateTime($coupon['expiry_date']) < new DateTime()) {
                                    $status = "Abgelaufen";
                                } elseif (isset($coupon['redeemed']) && $coupon['redeemed']) {
                                    $status = "Eingelöst";
                                }
                                echo htmlspecialchars($status);
                            ?>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </section>

        <!-- Bestellhistorie anzeigen -->
        <section id="order-history" style="display:none;">
            <h2>Bestellhistorie des Kunden</h2>
            <div id="orderHistory"></div>
            <button class="btn btn-secondary" onclick="hideOrderHistory()">Zurück</button>
        </section>
    </div>

    <script>
        function editProduct(id) {
            window.location.href = '../../Frontend/sites/edit_product.html?id=' + id;
        }

        function deleteProduct(id) {
            if (confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
                $.ajax({
                    type: "POST",
                    url: "admin.php",
                    data: { action: 'deleteProduct', id: id },
                    success: function(response) {
                        alert('Produkt gelöscht.');
                        location.reload();
                    }
                });
            }
        }

        function deactivateCustomer(id) {
            if (confirm('Möchten Sie diesen Kunden wirklich deaktivieren?')) {
                $.ajax({
                    type: "POST",
                    url: "admin.php",
                    data: { action: 'deactivateCustomer', id: id },
                    success: function(response) {
                        alert('Kunde deaktiviert.');
                        location.reload();
                    }
                });
            }
        }

        function activateCustomer(id) {
            if (confirm('Möchten Sie diesen Kunden wirklich aktivieren?')) {
                $.ajax({
                    type: "POST",
                    url: "admin.php",
                    data: { action: 'activateCustomer', id: id },
                    success: function(response) {
                        alert('Kunde aktiviert.');
                        location.reload();
                    }
                });
            }
        }

        function viewCustomerOrders(id) {
        // Verstecke die Kundenverwaltung und zeige den Bereich für die Bestellhistorie an
        $('#customer-management').hide();
        $('#order-history').show();

        // AJAX-Aufruf, um die Bestellhistorie des Kunden zu laden
        $.ajax({
            type: "GET",
            url: "admin.php",
            data: { action: 'getCustomerOrders', customer_id: id },
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    // Bestellhistorie anzeigen
                    var orders = response.orders;
                    var ordersHTML = "<table class='table table-bordered'>";
                    ordersHTML += "<tr><th>Bestellnummer</th><th>Datum</th><th>Gesamtbetrag</th><th>Status</th><th>Rechnung</th></tr>";

                    $.each(orders, function(index, order) {
                        ordersHTML += "<tr>";
                        ordersHTML += "<td>" + order.order_id + "</td>";
                        ordersHTML += "<td>" + order.order_date + "</td>";
                        ordersHTML += "<td>€" + order.total_amount + "</td>";
                        ordersHTML += "<td>" + order.status + "</td>";
                        ordersHTML += "<td><a href='../../Backend/businesslogic/generatePDF.php?order_id=" + order.order_id + "' class='invoice-link' data-orderid='" + order.order_id + "'>Rechnung einsehen</a></td>";
                        ordersHTML += "</tr>";
                    });

                    ordersHTML += "</table>";
                    $('#orderHistory').html(ordersHTML); // Hier wird der generierte HTML-Inhalt eingefügt
                } else {
                    alert('Fehler beim Laden der Bestellhistorie: ' + response.message);
                }
            },
            error: function() {
                alert('Ein Fehler ist bei der Kommunikation mit dem Server aufgetreten.');
            }
        });
    }

    function hideOrderHistory() {
        $('#order-history').hide();
        $('#customer-management').show();
    }

        $('#add-product-form').submit(function(event) {
            event.preventDefault();
            var formData = $(this).serialize();
            formData += '&action=addProduct';
            $.ajax({
                type: "POST",
                url: "admin.php",
                data: formData,
                success: function(response) {
                    alert('Produkt hinzugefügt.');
                    location.reload();
                }
            });
        });

        $('#add-coupon-form').submit(function(event) {
            event.preventDefault();
            var formData = $(this).serialize();
            formData += '&action=generateCoupon';
            $.ajax({
                type: "POST",
                url: "admin.php",
                data: formData,
                success: function(response) {
                    alert('Gutschein erstellt.');
                    location.reload();
                }
            });
        });
    </script>
</body>
</html>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $action = $_POST['action'] ?? '';

    if ($action === 'addProduct') {
        $name = $_POST['product-name'] ?? '';
        $description = $_POST['product-description'] ?? '';
        $rating = $_POST['product-rating'] ?? 0;
        $price = $_POST['product-price'] ?? 0;
        $imageUrl = $_POST['product-image-url'] ?? '';
        $category = $_POST['product-category'] ?? '';

        if (addProduct($name, $description, $rating, $price, $imageUrl, $category)) {
            echo json_encode(['success' => true, 'message' => 'Produkt erfolgreich hinzugefügt.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Produkts.']);
        }
    }

    if ($action === 'editProduct') {
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
    }

    if ($action === 'deleteProduct') {
        $id = $_POST['id'] ?? 0;
        if (deleteProduct($id)) {
            echo json_encode(['success' => true, 'message' => 'Produkt erfolgreich gelöscht.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen des Produkts.']);
        }
    }

    if ($action === 'deactivateCustomer') {
        $id = $_POST['id'] ?? 0;
        if (deactivateCustomer($id)) {
            echo json_encode(['success' => true, 'message' => 'Kunde erfolgreich deaktiviert.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Deaktivieren des Kunden.']);
        }
    }
    if ($action === 'activateCustomer') {
        $id = $_POST['id'] ?? 1;
        if (activateCustomer($id)) {
            echo json_encode(['success' => true, 'message' => 'Kunde erfolgreich aktiviert.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Aktivieren des Kunden.']);
        }
    }

    if ($action === 'generateCoupon') {
        $value = $_POST['coupon-value'] ?? 0;
        $expiryDate = $_POST['coupon-expiry'] ?? '';
        if (generateCoupon($value, $expiryDate)) {
            echo json_encode(['success' => true, 'message' => 'Gutschein erfolgreich erstellt.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Erstellen des Gutscheins.']);
        }
    }

    if ($action === 'getCustomerOrders') {
        $customer_id = $_GET['customer_id'] ?? 0;

        if ($customer_id == 0) {
            echo json_encode(['success' => false, 'message' => 'Ungültige Kunden-ID.']);
            exit;
        }

        $orders = getCustomerOrders($customer_id);

        if (!empty($orders)) {
            echo json_encode(['success' => true, 'orders' => $orders]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Keine Bestellungen gefunden.']);
        }
    }
}
?>
