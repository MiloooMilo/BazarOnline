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
                var orders = response.orders;
                var ordersHTML = "<table class='order-table'>";
                ordersHTML += "<tr><th>Bestellnummer</th><th>Datum</th><th>Gesamtbetrag</th><th>Rechnung</th></tr>";

                $.each(orders, function(index, order) {
                    ordersHTML += "<tr>";
                    ordersHTML += "<td>" + order.order_id + "</td>";
                    ordersHTML += "<td>" + order.order_date + "</td>";
                    ordersHTML += "<td>€" + order.total_amount + "</td>";



                    // Hier wird angenommen, dass es eine Liste von Produkten in der Bestellung gibt



                    ordersHTML += "<td><a href='../../Backend/businesslogic/generatePDF.php?order_id=" + order.order_id + "' class='invoice-link' data-orderid='" + order.order_id + "'>Rechnung einsehen</a></td>";
                    ordersHTML += "</tr>";
                });

                ordersHTML += "</table>";
                $('#orderHistory').html(ordersHTML); // Hier wird der generierte HTML-Inhalt eingefügt
            } else {
                alert('Fehler beim Laden der Bestellhistorie.');
            }
        },
        error: function() {
            alert('Ein Fehler ist bei der Kommunikation mit dem Server aufgetreten.');
        }
    });
}

function printInvoice(orderId) {
    // Öffne ein neues Fenster oder Tab mit der URL zur Druckseite
    window.open(`../../Backend/logic/print_invoice.php?order_id=${orderId}`, '_blank');
}