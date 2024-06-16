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
$(document).ready(function() {
    console.log("Document ready - Start lade Header");

    // Load the header and call adjustHeader after it's loaded
    $('#header-site').load("header.html", function() {
        console.log("Header geladen, rufe adjustHeader auf");
        adjustHeader();
    });

    // Event handler for "Add to Cart" button
    $(document).on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        addProductToCart(productId);
    });

    // Event handlers for cart item actions (increase, decrease, remove)
    $(document).on('click', '.remove, .decrease, .increase', function(e) {
        e.preventDefault();
        var productId = $(this).data('product-id');
        var action = $(this).hasClass('remove') ? 'remove' : $(this).hasClass('decrease') ? 'decrease' : 'increase';
        modifyProductInCart(productId, action);
    });

    // Load products from the backend
    loadProducts();
});

function loadProducts() {
    $.ajax({
        url: '../../Backend/config/show_product.php', 
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log("Products loaded:", data);
            window.allProducts = data; // Store products in a global variable for later use
            displayProducts(data);
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden der Daten:', error);
            displayError();
        }
    });
}

function displayProducts(data) {
    var outputArea = $('#output-area');
    outputArea.empty();
    data.forEach(function(product) {
        outputArea.append(
            `<li class="product-item">
                <div class="product-image">
                    <img src="${product.url}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-details">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">${product.price}€</div>
                </div>
                <button class="btn btn-primary d-inline-flex align-items-center add-button" type="button" data-product-id="${product.id}">In den Warenkorb legen</button>
            </li>`);
    });
}

function addProductToCart(productId) {
    // Ensure the global variable allProducts is populated
    if (!window.allProducts) {
        console.error("Produkte sind noch nicht geladen.");
        return;
    }

    var product = window.allProducts.find(function(p) {
        return p.id === productId;
    });

    if (product) {
        $.ajax({
            type: "POST",
            url: "../../Backend/config/add_to_cart.php",
            data: { product: JSON.stringify(product) },
            success: function(response) {
                console.log("Produkt in den Warenkorb gelegt:", response);
                updateCart();
            },
            error: function(xhr, status, error) {
                console.error("Fehler beim Hinzufügen des Produkts zum Warenkorb:", error);
            }
        });
    } else {
        console.error("Produkt nicht gefunden für die ID:", productId);
    }
}

function updateCart() {
    $.ajax({
        type: "GET",
        url: "../../Backend/config/get_cart.php", 
        dataType: "json",
        success: function(response) {
            console.log("Cart contents:", response);
            var cartArea = $('#cart-area');
            cartArea.empty();
            var total = 0;
            response.cart.forEach(function(product) {
                var lineTotal = product.quantity * product.price;
                total += lineTotal;

                var actions = `
                    <a href="#" class="increase" data-product-id="${product.id}"><i class="bi bi-plus-circle"></i></a>
                    <a href="#" class="decrease" data-product-id="${product.id}"><i class="bi bi-dash-circle"></i></a>
                    <a href="#" class="remove" data-product-id="${product.id}"><i class="bi bi-trash"></i></a>`;

                cartArea.append(
                    `<li class="cart-item">
                        <div class="cart-product-image">
                            <img src="${product.url}" alt="${product.name}" class="cart-img">
                        </div>
                        <div class="cart-product-details">
                            <div class="cart-product-name">${product.name}</div>
                            <div class="cart-product-quantity">Quantity: ${product.quantity}</div>
                            <div class="cart-product-price">${lineTotal.toFixed(2)}€</div>
                        </div>
                        <div class="cart-product-actions">
                            ${actions}
                        </div>
                    </li>`
                );
            });
            $('#cart-total').html('<strong>Total: ' + total.toFixed(2) + '€</strong>');
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

