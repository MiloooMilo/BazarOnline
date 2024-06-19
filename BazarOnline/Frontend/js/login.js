function loginprocess(event) {
    event.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Erfasst die Formulardaten
    var usernameEmail = document.getElementById("floatingInput").value;
    var password = document.getElementById("floatingPassword").value;
    var rememberMe = document.getElementById("flexCheckDefault").checked;

    var formData = {
        username_email: usernameEmail,
        passwort: password,
        remember_me: rememberMe
    };

    // Sendet JSON-Daten per AJAX
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/login.php",
        data: JSON.stringify(formData), // Sendet das Objekt als JSON-String
        contentType: "application/json; charset=utf-8", // Setzt den richtigen Content-Type für JSON
        dataType: "json", // Erwartet JSON-Antwort vom Server
        success: function(response) {
            if (response.success) {
                // Bei erfolgreicher Anmeldung den Status speichern und weiterleiten
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', response.user.username);

                // Überprüft, ob der Benutzer ein Admin ist
                if (response.user.rolle === 'admin') {
                    localStorage.setItem('isAdmin', 'true');
                } else {
                    localStorage.removeItem('isAdmin');
                }

                // Setzt oder löscht Cookies basierend auf der Remember Me Checkbox
                if (rememberMe) {
                    setCookie("username_email", usernameEmail, 30);
                    setCookie("passwort", password, 30);
                } else {
                    setCookie("username_email", "", -1);
                    setCookie("passwort", "", -1);
                }

                // Weiterleitung zur Startseite oder einer anderen Seite
                window.location.href = "../../Frontend/sites/index.html";
            } else {
                // Fehlermeldung anzeigen
                alert(response.message); // Pop-up-Benachrichtigung mit der Fehlermeldung
            }
        },
        error: function(xhr, status, error) {
            alert("Es gab einen Fehler bei der Anmeldung. Bitte versuchen Sie es erneut.");
        }
    });

    return false;
}

$(document).ready(function() {
    // Überprüft, ob Cookies gesetzt sind
    if (getCookie('username_email') && getCookie('passwort')) {
        $('#floatingInput').val(getCookie('username_email'));
        $('#floatingPassword').val(getCookie('passwort'));
        $('#flexCheckDefault').prop('checked', true);
    }
});

function setCookie(name, value, days) {
    // Funktion zum Setzen eines Cookies
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    // Funktion zum Abrufen eines Cookies
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
