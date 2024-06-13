function validateForm() {
    var pass = document.forms["regForm"]["passwort"].value;
    var confirmPass = document.forms["regForm"]["confirm_passwort"].value;
    if (pass !== confirmPass) {
        alert("Passwörter stimmen nicht überein!");
        return false;
    }
    // Weitere Validierungen hier hinzufügen
    return true;
}
// Script zur Produktanzeige und Warenkorblogik

$(document).ready(function() {
    console.log("Document ready - Start lade Header");
    // Lade den Header und rufe adjustHeader auf, nachdem der Header geladen ist
    $('#header-site').load("header.html", function() {
        console.log("Header geladen, rufe adjustHeader auf");
        adjustHeader(); // Funktion aufrufen, nachdem header.html geladen wurde
    });

    // Produkte laden und anzeigen
    loadProducts();
    $(document).on('click', '.category-button', function() {
        var selectedCategory = $(this).data('category');
        filterProducts(selectedCategory);
    });

    // Klick-Event für "In den Warenkorb legen" Button
    $(document).on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        addProductToCart(productId);
    });
    
    $(document).on('click', '.remove, .decrease', function(e) {
        e.preventDefault();
        var productId = $(this).data('product-id');
        var action = $(this).hasClass('remove') ? 'remove' : 'decrease';
        modifyProductInCart(productId, action);
    });
});

var allProducts = [];

function loadProducts() {
    $.ajax({
        type: "GET",
        url: "../json/products.json", // Pfad zur JSON-Datei
        cache: false,
        dataType: "json",
        success: function(response) {
            allProducts = response.productlist; // Speichere alle Produkte zur Filterung
            filterProducts('all'); // Zeige standardmäßig alle Produkte an
            console.log("Produkte geladen:", allProducts); // Debugging-Log
        },
        error: function() {
            displayError();
            console.error("Fehler beim Laden der Produkte"); // Debugging-Log
        }
    });
}


function displayProducts(products) {
    var outputArea = $('#output-area');
    outputArea.empty();

    products.forEach(function(product) { // Display all products
        outputArea.append(
            `<li class="product-item">
                <div class="product-image">
                    <img src="${product.image_url}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${product.price}€</div>
                </div>
                <button class="btn btn-primary d-inline-flex align-items-center add-button" type="button" data-product-id="${product.id}">In den Warenkorb legen</button>
            </li>`);
    });
}

function filterProducts(category) {
    console.log("Filtering products for category:", category); // Debugging line
    var filteredProducts = allProducts.filter(function(product) {
        return category === "all" || product.category === category;
    });
    displayProducts(filteredProducts);
}

function addProductToCart(productId) {
    var product = allProducts.find(function(p) {
        return p.id === productId;
    });

    if (product) {
        $.ajax({
            type: "POST",
            url: "../../Backend/config/add_to_cart.php", // Pfad zum Server-Skript
            data: { product: JSON.stringify(product) }, // Produktdaten als JSON-String senden
            success: function(response) {
                console.log("Antwort vom Server:", response);
                updateCart();
                console.log("Produkt in den Warenkorb gelegt:", response);
            },
            error: function() {
                console.error("Fehler beim Hinzufügen des Produkts zum Warenkorb");
            }
        });
    }
}


function updateCart() {
    $.ajax({
        type: "GET",
        url: "../../Backend/config/get_cart.php", // The server script to get the cart contents
        dataType: "json",
        success: function(response) {
            console.log("Cart contents:", response);
            var cartArea = $('#cart-area');
            cartArea.empty();
            var total = 0;
            response.cart.forEach(function(product) {
                var lineTotal = product.quantity * product.price;
                total += lineTotal;

                var actions = '';
                if (product.quantity > 1) {
                    actions = `<a href="#" class="decrease" data-product-id="${product.id}">decrease</a> <a href="#" class="remove" data-product-id="${product.id}">remove</a>`;
                } else {
                    actions = `<a href="#" class="remove" data-product-id="${product.id}">remove</a>`;
                }

                cartArea.append(
                    `<li>
                        ${product.name} x ${product.quantity} = ${lineTotal.toFixed(2)}€
                        ${actions}
                    </li>`
                );
            });
            cartArea.append('<li>Total: ' + total.toFixed(2) + '€</li>');
        },
        error: function(xhr, status, error) {
            console.error("Failed to get cart contents", xhr.responseText);
        }
    });
}

function modifyProductInCart(productId, action) {
    $.ajax({
        type: "POST",
        url: "../../Backend/config/remove_from_cart.php",
        data: JSON.stringify({ productId: productId, action: action }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            console.log("Product modified in cart:", response);
            updateCart();
        },
        error: function(xhr, status, error) {
            console.error("Failed to modify product in cart", xhr.responseText);
        }
    });
}

function displayError() {
    var outputArea = $('#output-area');
    outputArea.html('Failed to get data');
    outputArea.addClass('error-message');
}
