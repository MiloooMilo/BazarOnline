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

//Warenkorblogik

$(document).ready(function() {
    loadProducts();
    $('#header-site').load("header.html");

    $(document).on('click', '.category-button', function() {
        var selectedCategory = $(this).data('category');
        filterProducts(selectedCategory);
    });
    $(document).on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        addProductToCart(productId);
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
                <button class="btn btn-primary d-inline-flex align-items-center" type="button" data-product-id="${product.id}">In den Warenkorb legen</button>
            </li>`);
    });
}
/*button class="btn btn-primary d-inline-flex align-items-center" type="button" */
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
            url: "../../Backend/config/add_to_cart.php", // The server script to handle adding to cart
            data: { product: product },
            success: function(response) {
                updateCart();
                console.log("Product added to cart:", response);
            },
            error: function() {
                console.error("Failed to add product to cart");
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
            var cartArea = $('#cart-area');
            cartArea.empty();
            var total = 0;
            response.forEach(function(product) {
                var lineTotal = product.quantity * product.price;
                total += lineTotal;
                cartArea.append('<li>' + product.name + ' x ' + product.quantity + ' = ' + lineTotal.toFixed(2) + '€ <a href="#" class="remove" data-product-id="' + product.id + '">' + (product.quantity > 1 ? 'decrease' : 'remove') + '</a></li>');
            });
            cartArea.append('<li>Total: ' + total.toFixed(2) + '€</li>');
        },
        error: function() {
            console.error("Failed to get cart contents");
        }
    });
}

$(document).on('click', '.remove', function(e) {
    e.preventDefault();
    var productId = $(this).data('product-id');
    $.ajax({
        type: "POST",
        url: "../../Backend/config/remove_from_cart.php", // The server script to handle removing from cart
        data: { productId: productId },
        success: function(response) {
            updateCart();
            console.log("Product removed from cart:", response);
        },
        error: function() {
            console.error("Failed to remove product from cart");
        }
    });
});

function displayError() {
    var outputArea = $('#output-area');
    outputArea.html('Failed to get data');
    outputArea.addClass('error-message');
}