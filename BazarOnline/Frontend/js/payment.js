function addPaymentMethod() {
    // Sammle die Formulardaten
    const formData = {
        cardNumber: $('#card-number').val(),
        cardHolder: $('#card-holder').val(),
        expiryDate: $('#expiry-date').val(),
        cvv: $('#cvv').val()
    };

    // AJAX-Aufruf zum Hinzufügen der Zahlungsmethode
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/add_payment_method.php",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            if (response.success) {
                alert('Zahlungsmethode erfolgreich hinzugefügt.');
            } else {
                alert('Fehler beim Hinzufügen der Zahlungsmethode: ' + response.message);
            }
        }
    });
}
