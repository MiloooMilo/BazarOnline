function validateForm(event) {
    event.preventDefault(); // Standardformularübermittlung verhindern

    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("password1").value;

    // Überprüfen, ob Passwörter übereinstimmen
    if (password !== confirmPassword) {
        alert("Die Passwörter stimmen nicht überein.");
        return false;
    }

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
        passwort: password,
        zahlungsinformation: document.getElementById('zahlungsinformation').value
    };

    // JSON-Daten per AJAX senden
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/register.php",
        data: formData,
        dataType: "json",
        success: function(response) {
            if (response.success) {
                // Bei erfolgreicher Registrierung zur Erfolgsseite weiterleiten
                window.location.href = "../../Frontend/sites/login.html";
            } else {
                // Fehlermeldung anzeigen
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Fehler:', error);
            console.error('Details:', xhr.responseText);
            alert("Es gab einen Fehler bei der Registrierung. Bitte versuchen Sie es erneut.");
        }
    });

    return false; // Verhindert die Standardaktion des Formulars
}