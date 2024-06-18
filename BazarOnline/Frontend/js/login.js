function loginprocess(event) {
    event.preventDefault(); // Prevents the default form behavior

    // Capture form data
    var usernameEmail = document.getElementById("floatingInput").value;
    var password = document.getElementById("floatingPassword").value;
    var rememberMe = document.getElementById("flexCheckDefault").checked;

    // Log data to the console for verification
    console.log("Login attempt with Email/Username:", usernameEmail, "and Password:", password, "Remember Me:", rememberMe);

    var formData = {
        username_email: usernameEmail,
        passwort: password,
        remember_me: rememberMe
    };

    // Send JSON data via AJAX
    $.ajax({
        type: "POST",
        url: "../../Backend/logic/login.php",
        data: JSON.stringify(formData), // Send the object as a JSON string
        contentType: "application/json; charset=utf-8", // Set the correct content type for JSON
        dataType: "json", // Expect JSON response from server
        success: function(response) {
            console.log("Response from server:", response);
            if (response.success) {
                // On successful login, save status and redirect
                console.log("Login successful for user:", response.user.username);
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', response.user.username);

                // Check if user is an admin
                console.log("User role:", response.user.rolle); // Should be 'admin' if user is an admin
                if (response.user.rolle === 'admin') {
                    console.log("User is admin. Setting isAdmin in localStorage.");
                    localStorage.setItem('isAdmin', 'true');
                } else {
                    console.log("User is not admin. Removing isAdmin from localStorage.");
                    localStorage.removeItem('isAdmin');
                }

                // Set or clear cookies based on Remember Me checkbox
                if (rememberMe) {
                    setCookie("username_email", usernameEmail, 30);
                    setCookie("passwort", password, 30);
                } else {
                    setCookie("username_email", "", -1);
                    setCookie("passwort", "", -1);
                }

                // Redirect to homepage or another page
                window.location.href = "../../Frontend/sites/index.html";
            } else {
                // Display error message
                console.error("Login failed:", response.message);
                alert(response.message); // Pop-up notification with the error message
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

$(document).ready(function() {
    // Check if cookies are set
    if (getCookie('username_email') && getCookie('passwort')) {
        $('#floatingInput').val(getCookie('username_email'));
        $('#floatingPassword').val(getCookie('passwort'));
        $('#flexCheckDefault').prop('checked', true);
    }
});

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
