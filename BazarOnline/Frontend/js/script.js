

$(document).ready(function() {
    console.log("Document ready - Start lade Header");

    // Load the header and call adjustHeader after it's loaded
    $('#header-site').load("header.html", function() {
        console.log("Header geladen, rufe adjustHeader auf");
        adjustHeader();
    });

    // Load products from the backend
    loadProducts();

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
