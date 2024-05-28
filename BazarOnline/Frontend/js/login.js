$(document).ready(function () {
    const loginForm = $('#loginForm');
    const errorMessageDiv = $('#errorMessage');

    // Erstelle ein Element für Erfolgsmeldungen
    const successMessageDiv = $('<div></div>').addClass('alert alert-success').hide();
    loginForm.append(successMessageDiv);

    loginForm.on('submit', function (e) {
        e.preventDefault(); // Verhindert das Standardverhalten des Formulars

        const formData = new FormData(loginForm[0]);

        // Senden der Daten mit AJAX
        $.ajax({
            url: '../../Backend/config/loginfuntion.php', // Ändern Sie dies zu Ihrem Server-Endpunkt
            type: 'POST',
            data: formData,
            processData: false,  // jQuery soll nicht versuchen, die Daten zu verarbeiten
            contentType: false,  // jQuery soll nicht versuchen, den Content-Type zu setzen
            success: function (data) {
                if (data.success) {
                    successMessageDiv.text('Sie haben sich erfolgreich eingeloggt.').show();
                    setTimeout(function() {
                        window.location.href = '../views/index.html'; // Weiterleitung nach 3 Sekunden
                    }, 3000);
                } else {
                    errorMessageDiv.text('Login fehlgeschlagen: ' + data.message).show(); // Änderung hier
                    successMessageDiv.hide();
                }
            },
            error: function (xhr, status, error) {
                console.error('Fehler bei der Anfrage:', error);
                let errorMessage = 'Ein Fehler ist aufgetreten, bitte versuchen Sie es später erneut.';
                if (xhr.status === 500) {
                    errorMessage = 'Serverfehler, bitte kontaktieren Sie den Administrator.';
                } else if (xhr.status === 404) {
                    errorMessage = 'Dienst nicht gefunden.';
                }
                errorMessageDiv.text(errorMessage).show();
                successMessageDiv.hide();
            }
        });
    });
});
