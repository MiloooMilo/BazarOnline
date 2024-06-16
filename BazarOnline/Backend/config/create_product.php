<?php
session_start();
$isAdmin = isset($_SESSION['rolle']) && $_SESSION['rolle'] === 'admin';

// Überprüfen, ob der Benutzer eingeloggt ist und die Rolle 'admin' hat
//if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true || $_SESSION['rolle'] !== 'admin') {
    // Wenn nicht eingeloggt oder keine Admin-Rolle, weiterleiten zur Startseite oder Fehlerseite
//    header("Location: ../../Frontend/sites/index.html");
 //   exit;
//}


require_once("dbaccess.php");


if($_SERVER["REQUEST_METHOD"] == "POST"){
    $name = $_POST['name'];
    $price = $_POST['price'];
    $description = $_POST['description'];
    $url = $_POST['url'];
    $category = $_POST['category'];
    
    if (empty($name) || empty($price) || empty($description) || empty($url) || empty($category)) {
        die("Fehler bei der Erstellung des Produkts, überpürfe Eingabe!");
    }

$sql = "SELECT * FROM product where name = '$name'";
$result = $conn->query($sql);

if($result->num_rows > 0) {
    die("Dieser Produktname ist schon vergeben.");
}
$insertSql = "INSERT INTO product (name, price, description, url, category) VALUES ('$name', '$price', '$description', '$url', '$category')";


if ($conn->query($insertSql) === TRUE) {
    $_SESSION['name'] = $name;
    $_SESSION['price'] = $price;
    $_SESSION['description'] = $description;
    $_SESSION['url'] = $url;
    $_SESSION[`category`] = $category;
    echo("Produkt erfolgreich hinzugefügt.");
} else {
    echo "Fehler bei dem Einfügen: " . $conn->error;
}

}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Produkt erstellen</title>
    <link rel="stylesheet" href="../../Frontend/res/css/style.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <header class="header" id="header-site"></header>
    <div class="container">
        <h1>Produkt erstellen</h1>
        <!-- Formular zur Erstellung eines neuen Produkts -->
        <form id="createProductForm" method="POST" action="create_product.php">
            <div class="form-group">
                <label for="productName">Produktname</label>
                <input type="text" class="form-control" name="name" id="name" placeholder="Produktname">
            </div>
            <div class="form-group">
                <label for="productDescription">Produktbeschreibung</label>
                <textarea class="form-control" name="description" id="description" rows="3" placeholder="Produktbeschreibung"></textarea>
            </div>
            <div class="form-group">
                <label for="productPrice">Preis</label>
                <input type="float" class="form-control" name="price" id="price"  placeholder="Preis">
            </div>
            <div class="form-group">
                <label for="productImageUrl">Bild-URL</label>
                <input type="url" class="form-control" name="url" id="url"  placeholder="Bild-URL">
            </div>
            <div class="form-group">
                <label for="productCategory">Kategorie</label>
                <textarea class="form-control" name="category" id="category" placeholder="Produktkategorie"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Produkt erstellen</button>
        </form>
    </div>
</body>
</html>