$(document).ready(function() {
    loadAccountDetails();

    $('#accountForm').submit(function(event) {
        event.preventDefault();
        updateAccount();
    });
});

function loadAccountDetails() {
    $.ajax({
        type: "GET",
        url: "../../Backend/config/edit_user.php",
        dataType: "json",
        success: function(response) {
            if (response.success) {
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
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Laden der Kontodetails:', xhr.responseText);
        }
    });
}

function updateAccount() {
    const formData = {
        username: $('#username').val(),
        email: $('#email').val(),
        anrede: $('#anrede').val(),
        vorname: $('#vorname').val(),
        nachname: $('#nachname').val(),
        adresse: $('#adresse').val(),
        plz: $('#plz').val(),
        ort: $('#ort').val(),
        current_password: $('#current-password').val()
    };

    $.ajax({
        type: "POST",
        url: "../../Backend/config/edit_user.php",
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(response) {
            if (response.success) {
                alert('Kontodetails erfolgreich aktualisiert.');
            } else {
                alert('Fehler beim Aktualisieren der Kontodetails: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Fehler beim Aktualisieren der Kontodetails:', xhr.responseText);
        }
    });
}
