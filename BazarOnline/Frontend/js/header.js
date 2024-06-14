function adjustHeader() {
    console.log("adjustHeader-Funktion gestartet");

    // Suche nach dem Element, in das der Inhalt eingefügt werden soll
    const navEnd = document.querySelector('.col-md-3.text-end');
    console.log("Element '.col-md-3.text-end' gefunden:", navEnd);

    if (navEnd) { // Überprüfen, ob das Element existiert
        // Prüfe den Login-Status
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        console.log("Login-Status:", isLoggedIn);

        if (isLoggedIn) {
            console.log("Benutzer ist eingeloggt. Aktualisiere Header für eingeloggt.");

            // Benutzer ist eingeloggt, "Mein Konto" Dropdown und Logout anzeigen
            navEnd.innerHTML = `
                <div class="dropdown text-end">
                    <button class="btn btn-secondary dropdown-toggle" type="dropdown" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="true">
                        Mein Konto
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="accountDropdown">
                        <li><a class="dropdown-item" href="order_history.html"><i class="bi bi-basket3-fill me-2"></i> </i>Bestellverlauf</a></li>
                        <li><a class="dropdown-item" href="account.html"><i class="bi bi-person-circle me-2"></i>Kundenkonto verwalten</a></li>
                        <li><a class="dropdown-item" href="payment.html"><i class="bi bi-credit-card-2-back-fill me-2">  </i>Zahlungsmöglichkeit hinzufügen</a></li>
                        
                    </ul>
                    <button class="btn" id="logoutButton">Logout</button>
                </div>
            `;

            // Logout-Funktion hinzufügen
            document.getElementById('logoutButton').addEventListener('click', function() {
                console.log("Logout-Button geklickt");
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username'); // Optional: Entfernen des gespeicherten Benutzernamens
                console.log("Benutzer ausgeloggt");
                window.location.reload();
            });
        } else {
            console.log("Benutzer ist nicht eingeloggt. Aktualisiere Header für nicht eingeloggt.");

            // Benutzer ist nicht eingeloggt, Login und Sign-up anzeigen
            navEnd.innerHTML = `
                <a type="button" class="btn" href="login.html">Login</a>
                <a type="button" class="btn" href="register.html">Sign-up</a>
            `;
        }
    } else {
        console.error("Element '.col-md-3.text-end' nicht gefunden.");
    }
}

$(document).ready(function() {
    console.log("Document ready - Start lade Header");
    // Lade den Header und rufe adjustHeader auf, nachdem der Header geladen ist
    $('#header-site').load("header.html", function() {
        console.log("Header geladen, rufe adjustHeader auf");
        adjustHeader(); // Funktion aufrufen, nachdem header.html geladen wurde
    });
});
