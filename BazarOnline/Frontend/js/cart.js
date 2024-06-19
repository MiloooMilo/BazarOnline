$(document).ready(function() {
    updateCartCount();
    displayCart();

    // Hinzufügen von Produkten zum Warenkorb
    $('#output-area').on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        var product = window.allProducts.find(p => p.id == productId);
        addToCart(product);
    });

    // Aktualisieren der Menge im Warenkorb
    $('#cart-items').on('click', '.increase-qty', function() {
        var productId = $(this).data('product-id');
        updateCartItem(productId, 1);
    });

    $('#cart-items').on('click', '.decrease-qty', function() {
        var productId = $(this).data('product-id');
        updateCartItem(productId, -1);
    });

    // Entfernen eines Produkts aus dem Warenkorb
    $('#cart-items').on('click', '.kill', function() {
        var productId = $(this).data('product-id');
        removeCartItem(productId);
    });

    // Bestellvorgang einleiten
    $('#checkout-button').click(function() {
        if (!isUserLoggedIn()) {
            alert("Bitte loggen Sie sich ein, um die Bestellung abzuschließen.");
            window.location.href = "../../Frontend/sites/login.html"; // Weiterleiten zur Registrierungsseite
            return;
        }
        showPaymentOptions();
    });
});

function isUserLoggedIn() {
    // Überprüfen des Benutzer-Login-Status
    var loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    return loggedIn;
}

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
                    <button class="btn btn-sm btn-secondary kill" data-product-id="${product.id}">Entfernen</button>
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

function removeCartItem(productId) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(p => p.id != productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function showPaymentOptions() {
    var paymentOptions = `
        <div class="payment-options">
            <h4>Zahlungsmethode wählen</h4>
            <select id="payment-method" class="form-select">
                <option value="credit-card">Kreditkarte</option>
                <option value="paypal">PayPal</option>
                <option value="voucher">Gutschein</option>
            </select>
            <div id="voucher-field" class="mt-2" style="display: none;">
                <input type="text" id="voucher-code" class="form-control" placeholder="Gutscheincode">
            </div>
            <button id="confirm-order" class="btn btn-success mt-3">Bestellung bestätigen</button>
        </div>
    `;
    $('#cart-items').after(paymentOptions);

    $('#payment-method').change(function() {
        if ($(this).val() === 'voucher') {
            $('#voucher-field').show();
        } else {
            $('#voucher-field').hide();
        }
    });

    $('#confirm-order').click(function() {
        confirmOrder();
    });
}

function confirmOrder() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var paymentMethod = $('#payment-method').val();
    var voucherCode = $('#voucher-code').val();

    if (cart.length === 0) {
        alert("Ihr Warenkorb ist leer.");
        return;
    }

    var discount = 0;
    var voucherUsed = false;
    if (paymentMethod === 'voucher' && voucherCode === 'VALIDCODE') {
        discount = 10; // Beispiel: Abzug von 10€
        voucherUsed = true;
    }

    var totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    var amountToPay = totalPrice - discount;

    if (amountToPay < 0) amountToPay = 0;

    if (amountToPay > 0 && (paymentMethod === 'voucher' || paymentMethod === '')) {
        alert("Bitte wählen Sie eine Zahlungsmethode, da der Gutscheinwert nicht ausreicht.");
        return;
    }

    $.ajax({
        url: '../../Backend/config/process_order.php',
        method: 'POST',
        data: {
            cart: JSON.stringify(cart),
            paymentMethod: amountToPay > 0 ? paymentMethod : '',
            voucherCode: voucherUsed ? voucherCode : '',
            totalPrice: totalPrice
        },
        dataType: 'json',
        success: function(response) {
            if (response && response.success) {
                alert("Ihre Bestellung wurde erfolgreich abgeschlossen.");
                localStorage.removeItem('cart');
                updateCartCount();
                displayCart();
            } else {
                var errorMsg = response && response.error ? response.error : "Unbekannter Fehler";
                alert("Es gab ein Problem mit Ihrer Bestellung: " + errorMsg);
            }
        },
        error: function(xhr, status, error) {
            alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
    });
}
