function handleLogin(event) {
    event.preventDefault(); // Verhindert das Neuladen der Seite beim Absenden des Formulars
    let email = event.target.email.value;
    let password = event.target.password.value;

    // Hier kannst du die Logik für die normale Anmeldung einfügen
    console.log("E-Mail:", email);
    console.log("Passwort:", password);
}

function loginAlsGast() {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            returnSecureToken: true  // Fordert ein Token vom Server an
        })
    })
    .then(response => {
        // Überprüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        // Überprüfen, ob der Token vorhanden ist
        if (data.idToken) {
            console.log("Gastzugang erfolgreich:", data);
            return data.idToken;  // Das Token zurückgeben
        } else {
            throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
        }
    })
    .catch(error => {
        console.error("Fehler:", error);
    });
}

function gastLogin() {
    loginAlsGast().then((token) => {
        // Überprüfen, ob das Token erfolgreich erhalten wurde
        if (token) {
            sessionStorage.setItem('authToken', token); // Token speichern
            window.location.href = "../../assets/html/summary.html";    // Weiterleitung zur Gastseite
        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}

function logout() {
    // Löschen des Authentifizierungs-Tokens
    sessionStorage.removeItem('authToken');
    
    // Optional: Umleitung zur Login-Seite oder zum Startbildschirm
    window.location.href = "./assets/html/login.html"; // Oder eine andere geeignete Seite
}