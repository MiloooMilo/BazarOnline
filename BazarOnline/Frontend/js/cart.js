$(document).ready(function() {
    updateCartCount();
    displayCart();

    // Add product to cart
    $('#output-area').on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        var product = window.allProducts.find(p => p.id == productId);
        addToCart(product);
    });

    // Update cart item quantity
    $('#cart-items').on('click', '.increase-qty', function() {
        var productId = $(this).data('product-id');
        updateCartItem(productId, 1);
    });

    $('#cart-items').on('click', '.decrease-qty', function() {
        var productId = $(this).data('product-id');
        updateCartItem(productId, -1);
    });
});

function addToCart(product) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var existingProduct = cart.find(p => p.id == product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var totalItems = cart.reduce((total, product) => total + product.quantity, 0);
    $('#cart-count').text(totalItems);
}

function displayCart() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var cartItems = $('#cart-items');
    var totalPrice = 0;

    cartItems.empty();
    cart.forEach(function(product) {
        var itemTotal = product.price * product.quantity;
        totalPrice += itemTotal;
        cartItems.append(
            `<li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h5>${product.name}</h5>
                    <p>${product.price}€ x ${product.quantity}</p>
                </div>
                <div>
                    <button class="btn btn-sm btn-secondary increase-qty" data-product-id="${product.id}">+</button>
                    <button class="btn btn-sm btn-secondary decrease-qty" data-product-id="${product.id}">-</button>
                </div>
                <span>${itemTotal}€</span>
            </li>`);
    });

    $('#total-price').text(totalPrice);
}

function updateCartItem(productId, change) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var product = cart.find(p => p.id == productId);

    if (product) {
        product.quantity += change;
        if (product.quantity <= 0) {
            cart = cart.filter(p => p.id != productId);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}
