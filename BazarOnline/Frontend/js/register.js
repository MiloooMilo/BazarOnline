$(document).ready(function() {
    $('#header-site').load("header.html");
});
function validateForm(event) {
    console.log("Validierung beginnt..."); // Debug-Ausgabe

    // Holen der Passwörter
    var passwort = document.getElementById("passwort").value;
    var confirmPassword = document.getElementById("password1").value;

    // Überprüfen, ob die Passwörter übereinstimmen
    if (passwort !== confirmPassword) {
        alert("Die Passwörter stimmen nicht überein");
        return false;
    }
    console.log("Passwörter stimmen überein. Formular wird jetzt gesendet..."); // Debug-Ausgabe

    // Verhindert die Standardformularübermittlung
    event.preventDefault();

    try {
        // Formulardaten sammeln
        let formData = {
            anrede: document.getElementById('anrede').value,
            vorname: document.getElementById('vorname').value,
            nachname: document.getElementById('nachname').value,
            adresse: document.getElementById('adresse').value,
            plz: document.getElementById('plz').value,
            ort: document.getElementById('ort').value,
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            passwort: document.getElementById('passwort').value,
            zahlungsinformation: document.getElementById('zahlungsinformation').value
        };

        console.log("Gesammelte Formulardaten: ", formData); // Debug-Ausgabe

        // JSON-Daten senden
        $.ajax({
            type: "POST",
            url: '../../Backend/logic/register.php',
            data: JSON.stringify(formData),
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                console.log("Antwort erhalten: ", response); // Debug-Ausgabe
                alert(response.message);
                if (response.success) {
                    // Weiterleitung oder weitere Aktionen bei erfolgreicher Registrierung
                    window.location.href = "../../Frontend/sites/login.html"; // Weiterleitung zur Login-Seite
                }
            },
            error: function(xhr, status, error) {
                console.error('Fehler:', error);
                console.error('Details:', xhr.responseText);
                alert("Es gab einen Fehler bei der Registrierung. Bitte versuchen Sie es erneut.");
            }
        });
    } catch (err) {
        console.error("Ein Fehler ist aufgetreten: ", err.message);
    }

    return false; // Verhindert die Standardaktion des Formulars
}
