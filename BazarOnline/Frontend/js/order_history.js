$(document).ready(function() {
    loadOrderHistory();
});

function loadOrderHistory() {
    // AJAX-Aufruf, um die Bestellhistorie zu laden
    $.ajax({
        type: "GET",
        url: "../../Backend/logic/get_order_history.php",
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
                                <ul class="list-group">
                                    ${order.items.map(item => `
                                        <li class="list-group-item">
                                            ${item.product_name} - ${item.quantity} x ${item.price}€
                                        </li>
                                    `).join('')}
                                </ul>
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
    // AJAX-Aufruf, um die Rechnungsdetails zu laden und zu drucken
    window.open(`../../Backend/logic/print_invoice.php?order_id=${orderId}`, '_blank');
}
