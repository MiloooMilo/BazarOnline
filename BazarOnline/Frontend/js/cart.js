$(document).ready(function() {
    updateCartCount();
    displayCart();

    // Hinzufügen von Produkten zum Warenkorb
    $('#output-area').on('click', '.add-button', function() {
        var productId = $(this).data('product-id');
        console.log('Produkt zur Bestellung hinzufügen, Produkt-ID:', productId);
        var product = window.allProducts.find(p => p.id == productId);
        console.log('Produktdetails:', product);
        addToCart(product);
    });

    // Aktualisieren der Menge im Warenkorb
    $('#cart-items').on('click', '.increase-qty', function() {
        var productId = $(this).data('product-id');
        console.log('Erhöhen der Menge für Produkt-ID:', productId);
        updateCartItem(productId, 1);
    });

    $('#cart-items').on('click', '.decrease-qty', function() {
        var productId = $(this).data('product-id');
        console.log('Verringern der Menge für Produkt-ID:', productId);
        updateCartItem(productId, -1);
    });

    // Entfernen eines Produkts aus dem Warenkorb
    $('#cart-items').on('click', '.kill', function() {
        var productId = $(this).data('product-id');
        console.log('Entfernen des Produkts aus dem Warenkorb, Produkt-ID:', productId);
        removeCartItem(productId);
    });

    // Bestellvorgang einleiten
    $('#checkout-button').click(function() {
        console.log('Checkout-Button geklickt');
        if (!isUserLoggedIn()) {
            alert("Bitte loggen Sie sich ein, um die Bestellung abzuschließen.");
            return;
        }
        showPaymentOptions();
    });
});

function isUserLoggedIn() {
    // Überprüfen des Benutzer-Login-Status
    var loggedIn = true; // Platzhalter-Logik für tatsächliche Login-Überprüfung
    console.log('Benutzer eingeloggt:', loggedIn);
    return loggedIn;
}

function addToCart(product) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var existingProduct = cart.find(p => p.id == product.id);
    console.log('Aktueller Warenkorb:', cart);

    if (existingProduct) {
        existingProduct.quantity += 1;
        console.log('Menge des vorhandenen Produkts erhöht:', existingProduct);
    } else {
        product.quantity = 1;
        cart.push(product);
        console.log('Produkt neu hinzugefügt:', product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var totalItems = cart.reduce((total, product) => total + product.quantity, 0);
    console.log('Gesamtanzahl der Artikel im Warenkorb:', totalItems);
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
        console.log('Produkt im Warenkorb:', product, 'Einzelpreis:', product.price, 'Gesamtpreis für dieses Produkt:', itemTotal);
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

    console.log('Gesamtpreis des Warenkorbs:', totalPrice);
    $('#total-price').text(totalPrice);
}

function updateCartItem(productId, change) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var product = cart.find(p => p.id == productId);

    if (product) {
        product.quantity += change;
        console.log('Aktualisierte Menge des Produkts:', product);
        if (product.quantity <= 0) {
            cart = cart.filter(p => p.id != productId);
            console.log('Produkt entfernt aufgrund Menge <= 0:', productId);
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function removeCartItem(productId) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var product = cart.find(p => p.id == productId);

    if (product) {
        product.quantity = 0;
        cart = cart.filter(p => p.id != productId);
        console.log('Produkt vollständig aus dem Warenkorb entfernt:', productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

function showPaymentOptions() {
    console.log('Zahlungsoptionen anzeigen');
    // Erzeuge ein Formular zur Auswahl der Zahlungsmethode und Eingabe eines Gutscheins
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

    // Event-Listener für Zahlungsmethode
    $('#payment-method').change(function() {
        console.log('Zahlungsmethode geändert:', $(this).val());
        if ($(this).val() === 'voucher') {
            $('#voucher-field').show();
        } else {
            $('#voucher-field').hide();
        }
    });

    // Event-Listener für Bestellbestätigung
    $('#confirm-order').click(function() {
        console.log('Bestellbestätigung geklickt');
        confirmOrder();
    });
}

function confirmOrder() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var paymentMethod = $('#payment-method').val();
    var voucherCode = $('#voucher-code').val();
    console.log('Bestellung wird bestätigt mit:', { cart, paymentMethod, voucherCode });

    if (cart.length === 0) {
        alert("Ihr Warenkorb ist leer.");
        return;
    }

    // Dummy-Logik zur Gutscheinverarbeitung
    var discount = 0;
    var voucherUsed = false;
    if (paymentMethod === 'voucher' && voucherCode === 'VALIDCODE') {
        discount = 10; // Beispiel: Abzug von 10€
        voucherUsed = true;
        console.log('Gutscheinwert angewendet:', discount);
    }

    // Gesamtsumme berechnen
    var totalPrice = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    var amountToPay = totalPrice - discount;

    if (amountToPay < 0) amountToPay = 0; // Negativer Preis ist nicht möglich
    console.log('Gesamtpreis nach Rabatt:', amountToPay);

    // Überprüfen, ob eine Zahlungsmethode erforderlich ist
    if (amountToPay > 0 && (paymentMethod === 'voucher' || paymentMethod === '')) {
        alert("Bitte wählen Sie eine Zahlungsmethode, da der Gutscheinwert nicht ausreicht.");
        return;
    }

    // AJAX-Anfrage zur Bestellverarbeitung
    $.ajax({
        url: '../../Backend/config/process_order.php',
        method: 'POST',
        data: {
            cart: JSON.stringify(cart),
            paymentMethod: amountToPay > 0 ? paymentMethod : '', // Zahlungsmethode nur senden, wenn erforderlich
            voucherCode: voucherUsed ? voucherCode : '', // Gutscheincode nur senden, wenn verwendet
            totalPrice: totalPrice
        },
        dataType: 'json', // Erwartet eine JSON-Antwort vom Server
        success: function(response) {
            console.log('Serverantwort:', response);

            // Sicherstellen, dass die Antwort ein Objekt ist und `success` enthält
            if (response && response.success) {
                alert("Ihre Bestellung wurde erfolgreich abgeschlossen.");
                localStorage.removeItem('cart'); // Warenkorb leeren
                updateCartCount();
                displayCart();
            } else {
                // Genaue Fehlermeldung anzeigen
                var errorMsg = response && response.error ? response.error : "Unbekannter Fehler";
                alert("Es gab ein Problem mit Ihrer Bestellung: " + errorMsg);
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX-Fehler:', { status, error });
            alert("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
        }
    });
}
