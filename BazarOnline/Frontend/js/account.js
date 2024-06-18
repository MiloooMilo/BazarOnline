$(document).ready(function() {
    loadAccountDetails();
});

function loadAccountDetails() {
    // AJAX-Aufruf, um die Kontodetails zu laden
    $.ajax({
        type: "GET",
        url: "../../Backend/logic/get_account_details.php",
        dataType: "json",
        success: function(response) {
            if (response.success) {
                // Fülle die Formularfelder mit den Daten des Benutzers
                $('#username').val(response.user.username);
                $('#email').val(response.user.email);
                $('#anrede').val(response.user.anrede);
                $('#vorname').val(response.user.vorname);
                $('#nachname').val(response.user.nachname);
                $('#adresse').val(response.user.adresse);
                $('#plz').val(response.user.plz);
                $('#ort').val(response.user.ort);
            } else {
                alert('Fehler beim Laden der Kontodetails.');
            }
        }
    });
}

function updateAccount() {
    // Passwort-Eingabe verlangen
    const password = prompt("Bitte geben Sie Ihr Passwort ein, um die Änderungen zu bestätigen:");

    if (password) {
        // Formulardaten sammeln
        const formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            anrede: $('#anrede').val(),
            vorname: $('#vorname').val(),
            nachname: $('#nachname').val(),
            adresse: $('#adresse').val(),
            plz: $('#plz').val(),
            ort: $('#ort').val(),
            passwort: password
        };

        // AJAX-Aufruf zum Aktualisieren der Kontodetails
        $.ajax({
            type: "POST",
            url: "../../Backend/logic/update_account.php",
            data: JSON.stringify(formData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                if (response.success) {
                    alert('Kontodetails erfolgreich aktualisiert.');
                } else {
                    alert('Fehler beim Aktualisieren der Kontodetails: ' + response.message);
                }
            }
        });
    }
}
