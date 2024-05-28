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
function valideLogin() {
    var user = document.forms["login"]["username"].value;
}

//Warenkorblogik

$(document).ready(function() {
    loadProducts();
    $('#header-site').load("header.html");

    $(document).on('click', '.category-button', function() {
        var selectedCategory = $(this).data('category');
        filterProducts(selectedCategory);
    });
});

var allProducts = [];

function loadProducts() {
    $.ajax({
        type: "GET",
        url: "../json/products.json",
        cache: false,
        dataType: "json",
        success: function(response) {
            allProducts = response.productlist; // Save all products for filtering
            filterProducts('all'); // Display all products by default
        },
        error: function() {
            displayError();
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
                <button class="add-button" data-product-id="${product.id}">In den Warenkorb legen</button>
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

$(document).on('click', '.add-button', function() {
    var productId = $(this).data('product-id');
    addProductToCart(productId);
});

var cart = {};

function addProductToCart(productId) {
    var product = cart[productId] || {
        quantity: 0,
        details: $('#output-area').find('button[data-product-id="' + productId + '"]').closest('li').clone().children().remove().end().text().trim(),
        price: parseFloat($('#output-area').find('button[data-product-id="' + productId + '"]').closest('li').text().match(/(\d+(\.\d+)?)/)[0])
    };
    product.quantity++;
    cart[productId] = product;
    updateCart();
}

function updateCart() {
    var cartArea = $('#cart-area');
    cartArea.empty();
    var total = 0;
    $.each(cart, function(id, product) {
        var lineTotal = product.quantity * product.price;
        total += lineTotal;
        cartArea.append('<li>' + product.details + ' x ' + product.quantity + ' = ' + lineTotal.toFixed(2) + '€ <a href="#" class="remove" data-product-id="' + id + '">' + (product.quantity > 1 ? 'decrease' : 'remove') + '</a></li>');
    });
    cartArea.append('<li>Total: ' + total.toFixed(2) + '€</li>');
}

$(document).on('click', '.remove', function(e) {
    e.preventDefault();
    var productId = $(this).data('product-id');
    if (cart[productId].quantity > 1) {
        cart[productId].quantity--;
    } else {
        delete cart[productId];
    }
    updateCart();
});

function displayError() {
    var outputArea = $('#output-area');
    outputArea.html('Failed to get data');
    outputArea.addClass('error-message');
}