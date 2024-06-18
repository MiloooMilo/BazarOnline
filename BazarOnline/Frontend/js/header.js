$(document).ready(function() {
    console.log("Document ready - Start lade Header");

    // Überprüfen, ob der Header bereits geladen wurde
    if (!$('#header-site').hasClass('loaded')) {
        $('#header-site').load("../../Frontend/sites/header.html", function() {
            console.log("Header geladen, rufe adjustHeader auf");
            adjustHeader();
            $('#header-site').addClass('loaded'); // Markiere den Header als geladen
        });
    } else {
        console.log("Header bereits geladen");
    }
});
function adjustHeader() {
    console.log("adjustHeader-Funktion gestartet");

    const navEnd = document.querySelector('.col-md-3.text-end');
    console.log("Element '.col-md-3.text-end' gefunden:", navEnd);

    if (navEnd) {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const isAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log("Login-Status:", isLoggedIn, "Admin-Status:", isAdmin);

        // Überprüfen, ob der Benutzer ein Admin ist und den Admin-Button nur hinzufügen, wenn er es ist
        if (isAdmin) {
            console.log("Benutzer ist Admin. Admin-Button wird hinzugefügt.");
            const adminButton = '<li><a href="../../Backend/config/admin.php" class="nav-link px-2 text-danger">Admin</a></li>';
            document.querySelector('.nav').insertAdjacentHTML('beforeend', adminButton);
        } else {
            console.log("Benutzer ist kein Admin.");
        }

        if (isLoggedIn) {
            console.log("Benutzer ist eingeloggt. Aktualisiere Header für eingeloggt.");

            navEnd.innerHTML = `
                <div class="dropdown text-end">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="accountDropdown" data-bs-toggle="dropdown" aria-expanded="true">
                        Mein Konto
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="accountDropdown">
                        <li><a class="dropdown-item" href="../../Frontend/sites/order_history.html"><i class="bi bi-basket3-fill me-2"></i>Bestellverlauf</a></li>
                        <li><a class="dropdown-item" href="../../Frontend/sites/account.html"><i class="bi bi-person-circle me-2"></i>Kundenkonto verwalten</a></li>
                        <li><a class="dropdown-item" href="../../Frontend/sites/payment.html"><i class="bi bi-credit-card-2-back-fill me-2"></i>Zahlungsmöglichkeit hinzufügen</a></li>
                    </ul>
                    <button class="btn btn-outline-danger ms-2" id="logoutButton">Logout</button>
                </div>
            `;

            document.getElementById('logoutButton').addEventListener('click', function() {
                console.log("Logout-Button geklickt");
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isAdmin');
                localStorage.removeItem('username');
                console.log("Benutzer ausgeloggt");
                window.location.reload();
            });
        } else {
            console.log("Benutzer ist nicht eingeloggt. Aktualisiere Header für nicht eingeloggt.");

            navEnd.innerHTML = `
                <a type="button" class="btn btn-outline-primary me-2" href="login.html">Login</a>
                <a type="button" class="btn btn-primary" href="register.html">Sign-up</a>
            `;
        }
    } else {
        console.error("Element '.col-md-3.text-end' nicht gefunden.");
    }
}
