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

var cart = []; // Initialisiere ein leeres Array für den Warenkorb

$(document).ready(function() {
    console.log("Document ready - Start lade Header");

    // Load the header and call adjustHeader after it's loaded
    $('#header-site').load("header.html", function() {
        console.log("Header geladen, rufe adjustHeader auf");
        adjustHeader();
    });

    // Load products from the backend
    loadProducts();

    // Event listener für die "In den Warenkorb legen" Buttons
    $('#output-area').on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        addToCart(productId);
    });

    // Event listener für Warenkorb-Updates
    $('#cart-area').on('click', '.remove-button', function() {
        var productId = $(this).data('product-id');
        updateCart(productId, 0, true); // Entfernt das Produkt aus dem Warenkorb
    });

    $('#cart-area').on('click', '.increase-button', function() {
        var productId = $(this).data('product-id');
        updateCart(productId, 1); // Erhöht die Menge um 1
    });

    $('#cart-area').on('click', '.decrease-button', function() {
        var productId = $(this).data('product-id');
        updateCart(productId, -1); // Verringert die Menge um 1
    });

    $('.category-button').click(function() {
        var selectedCategory = $(this).data('category');
        loadProducts(selectedCategory);
    });

    // Live-Suche während des Tippens
    $('#search-input').on('input', function() {
        var searchTerm = $(this).val();
        if (searchTerm.length > 0) {
            searchProducts(searchTerm);
        } else {
            $('#suggestions').empty();
        }
    });

    // Suche bei Absenden des Formulars
    $('#search-form').submit(function(e) {
        e.preventDefault();
        var searchTerm = $('#search-input').val();
        if (searchTerm.length > 0) {
            searchProducts(searchTerm, true); // Zeige das genaue Produkt bei Absenden
        }
    });

    // Vorschlag auswählen und Produkt anzeigen
    $('#suggestions').on('click', 'li', function() {
        var productId = $(this).data('product-id');
        var product = window.allProducts.find(p => p.id == productId);
        if (product) {
            displayProducts([product]); // Zeige nur das ausgewählte Produkt
            $('#suggestions').empty(); // Vorschläge leeren
            $('#search-input').val(product.name); // Suchfeld mit dem ausgewählten Namen füllen
        }
    });
});

function loadProducts(category = '') {
    $.ajax({
        url: '../../Backend/config/show_product.php',
        type: 'GET',
        data: { category: category },
        dataType: 'json',
        success: function(data) {
            console.log("Products loaded:", data);
            window.allProducts = data; // Store products in a global variable for later use
            displayProducts(data);
        },
        error: function(xhr, status, error) {
            console.error('Error loading data:', error);
            displayError();
        }
    });
}

function displayProducts(data) {
    var outputArea = $('#output-area');
    outputArea.empty();
    data.forEach(function(product) {
        outputArea.append(
            `<li class="product-item col">
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

function addToCart(productId) {
    var product = window.allProducts.find(p => p.id == productId);
    if (product) {
        var existingProduct = cart.find(p => p.id == productId);
        if (existingProduct) {
            existingProduct.quantity += 1; // Erhöhe die Menge, wenn das Produkt bereits im Warenkorb ist
        } else {
            product.quantity = 1; // Setze die Menge auf 1, wenn das Produkt neu ist
            cart.push(product);
        }
        console.log("Warenkorb:", cart);
        renderCart();
    } else {
        console.error('Produkt nicht gefunden:', productId);
    }
}

function updateCart(productId, quantityChange, remove = false) {
    var productIndex = cart.findIndex(p => p.id == productId);
    if (productIndex > -1) {
        var product = cart[productIndex];
        
        if (remove) {
            product.quantity = 0; // Setze die Menge auf 0
        } else {
            product.quantity += quantityChange;
        }
        
        if (product.quantity <= 0) {
            cart.splice(productIndex, 1); // Entferne das Produkt, wenn die Menge 0 oder weniger ist
        }
        
        console.log("Warenkorb aktualisiert:", cart);
        renderCart();
    } else {
        console.error('Produkt nicht im Warenkorb gefunden:', productId);
    }
}

function renderCart() {
    var cartArea = $('#cart-area');
    cartArea.empty();
    if (cart.length === 0) {
        cartArea.append('<p>Ihr Warenkorb ist leer.</p>');
    } else {
        cart.forEach(function(product) {
            cartArea.append(
                `<li class="cart-item list-group-item">
                    <div class="cart-product_image"><img src="${product.url}" height="50px" alt="${product.name}" class="product-img"></div>
                    <div class="cart-product-name">${product.name}</div>
                    <div class="cart-product-quantity d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary decrease-button me-2" data-product-id="${product.id}">-</button>
                        <span>${product.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-button ms-2" data-product-id="${product.id}">+</button>
                    </div>
                    <button class="btn btn-sm btn-danger remove-button ms-3" type="button" data-product-id="${product.id}">Entfernen</button>
                </li>`);
        });
    }
}

function displayError() {
    $('#output-area').append('<p>Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.</p>');
}

// Funktion für die Live-Suche
function searchProducts(query, exactMatch = false) {
    var results = window.allProducts.filter(function(product) {
        if (exactMatch) {
            return product.name.toLowerCase() === query.toLowerCase();
        } else {
            return product.name.toLowerCase().includes(query.toLowerCase());
        }
    });

    if (exactMatch) {
        displayProducts(results); // Zeige nur das exakte Produkt bei der Suche
    } else {
        var suggestions = $('#suggestions');
        suggestions.empty();
        results.forEach(function(product) {
            suggestions.append(`<li class="suggestion-item list-group-item" data-product-id="${product.id}">${product.name}</li>`);
        });
    }
}
