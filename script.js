function handleLogin(event) {
    event.preventDefault(); // Verhindert das Standard-Formularverhalten

    let email = event.target.email.value;
    let password = event.target.password.value;

    // Überprüfen, ob E-Mail und Passwort eingegeben wurden
    if (!email || !password) {
        console.error("Bitte E-Mail und Passwort eingeben");
        return;
    }

    // Firebase REST API für die E-Mail- und Passwort-Authentifizierung
    fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.idToken) {
            console.log("Anmeldung erfolgreich:", data);
            sessionStorage.setItem('authToken', data.idToken); // Speichere den Token in sessionStorage
            window.location.href = "assets/html/summary.html"; // Weiterleitung zur summary.html
        } else {
            throw new Error("Anmeldung fehlgeschlagen: Kein Token erhalten");
        }
    })
    .catch(error => {
        console.error("Fehler bei der Anmeldung:", error.message);
    });
}

function loginAlsGast() {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            returnSecureToken: true 
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Fehler: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {        
        if (data.idToken) {
            console.log("Gastzugang erfolgreich:", data);
            let guestId = data.localId; // Gast-ID aus den Daten
            let guestRef = `/guests/${guestId}`; // Pfad zur Speicherung der Gastdaten

            // Hier kannst du zusätzliche Daten für den Gast speichern, z.B. einen anonymen Benutzernamen
            fetch(`https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app${guestRef}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: "Gast User", // Anonymen Namen setzen
                    
                })
            });

            return data.idToken; 
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
        if (token) {
            sessionStorage.setItem('authToken', token); 
            window.location.href = "assets/html/summary.html"; 
        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}

function gastLogin() {
    loginAlsGast().then((token) => {      
        if (token) {
            sessionStorage.setItem('authToken', token); 
            window.location.href = "assets/html/summary.html"; 
        } else {
            console.error("Gastzugang fehlgeschlagen: Kein Token erhalten");
        }
    });
}

function logout() {
    sessionStorage.removeItem('authToken');    
    window.location.href = "../../index.html"; 
}

