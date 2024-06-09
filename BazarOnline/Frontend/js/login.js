function loginprocess(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Erfasst die Formulardaten
    var usernameEmail = document.getElementById("floatingInput").value;
    var password = document.getElementById("floatingPassword").value;

    // Sammelt die Daten in einem Objekt
    var formData = {
        username_email: usernameEmail,
        passwort: password
    };

    // JSON-Daten per AJAX senden
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/login.php", // Pfad zum PHP-Login-Skript
        data: formData,
        dataType: "json",
        success: function(response) {
            if (response.success) {
                // Bei erfolgreicher Anmeldung zur Erfolgsseite weiterleiten
                window.location.href = "../../Frontend/sites/index.html"; // Erfolgsseite
                console.log("Eingeloggt als: ", response.user);
            } else {
                // Fehlermeldung anzeigen
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Fehler:', error);
            console.error('Details:', xhr.responseText);
            alert("Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.");
        }
    });

    return false; // Verhindert die Standardaktion des Formulars
}
