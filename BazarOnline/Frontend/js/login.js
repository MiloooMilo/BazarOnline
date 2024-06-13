function loginprocess(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Erfassen der Formulardaten
    var usernameEmail = document.getElementById("floatingInput").value;
    var password = document.getElementById("floatingPassword").value;

    // Konsolenausgabe zur Überprüfung der Eingabedaten
    console.log("Anmeldeversuch mit E-Mail/Benutzername:", usernameEmail, "und Passwort:", password);

    var formData = {
        username_email: usernameEmail,
        passwort: password
    };

    // JSON-Daten per AJAX senden
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/login.php",
        data: JSON.stringify(formData), // Sende das Objekt als JSON-String
        contentType: "application/json; charset=utf-8", // Setze den richtigen Content-Type für JSON
        dataType: "json", // Erwarte JSON-Antwort vom Server
        success: function(response) {
            console.log("Antwort vom Server:", response);
            if (response.success) {
                // Bei erfolgreicher Anmeldung den Status speichern und weiterleiten
                console.log("Login erfolgreich für Benutzer:", response.user.username);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', response.user.username);
                window.location.href = "../../Frontend/sites/index.html";
            } else {
                // Fehlermeldung anzeigen
                console.error("Login fehlgeschlagen:", response.message);
                alert(response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error('Fehler bei der Anmeldung:', error);
            console.error('Details:', xhr.responseText);
            alert("Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.");
        }
    });

    return false;
}
