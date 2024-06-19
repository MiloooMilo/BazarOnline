$(document).ready(function() {
    loadOrderHistory();
});

function loadOrderHistory() {
    // AJAX-Aufruf, um die Bestellhistorie zu laden
    $.ajax({
        type: "GET",
        url: "../../Backend/config/get_order_history.php",
        dataType: "json",
        success: function(response) {
            if (response.success) {
                // Bestellhistorie anzeigen
                let orderHistory = $('#order-history');
                orderHistory.empty();
                response.orders.forEach(order => {
                    let orderElement = `
                        <div class="card mb-3">
                            <div class="card-header">
                                Bestellung #${order.order_id} - ${order.order_date}
                                <button class="btn btn-sm btn-outline-primary float-end" onclick="printInvoice(${order.order_id})">Rechnung drucken</button>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Gesamtbetrag: ${order.total_amount}€</h5>
                                
                            </div>
                        </div>
                    `;
                    orderHistory.append(orderElement);
                });
            } else {
                alert('Fehler beim Laden der Bestellhistorie.');
            }
        }
    });
}

function printInvoice(orderId) {
    // Öffne ein neues Fenster oder Tab mit der URL zur Druckseite
    window.open(`../../Backend/logic/print_invoice.php?order_id=${orderId}`, '_blank');
}
