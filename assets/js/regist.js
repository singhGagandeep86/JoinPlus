document.addEventListener('DOMContentLoaded', () => {
    let userName = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let privacyPolicy = document.getElementById('privacyPolicy');
    let submitButton = document.getElementById('submitButton');

    // Funktion, um den Button nur zu aktivieren, wenn alles korrekt ist
    function validateForm() {
        // Aktivieren des Submit-Buttons, wenn Passwörter übereinstimmen und die Datenschutzrichtlinie akzeptiert wurde
        if (
            password.value &&
            confirmPassword.value &&
            password.value === confirmPassword.value &&
            privacyPolicy.checked &&
            userName.value.trim() !== ''
        ) {
            submitButton.disabled = false; // Aktiviert den Button
            document.getElementById('submitButton').classList.add('login');
        } else {
            submitButton.disabled = true; // Deaktiviert den Button
        }
    }

    // Überprüfe die Formulardaten
    password.addEventListener('input', validateForm);
    confirmPassword.addEventListener('input', validateForm);
    privacyPolicy.addEventListener('change', validateForm);

    // Registrierungs-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);

    function handleRegistration(event) {
        event.preventDefault(); // Verhindert das Standard-Formularverhalten

        let name = userName.value;
        let emailValue = email.value;
        let passwordValue = password.value;

        // Firebase REST API für die Registrierung
        fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue,
                name: name,
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
                    let token = data.idToken;
                    let uid = data.localId;                   
                    createDataFb(name, emailValue, token, uid);

                    sessionStorage.setItem('authToken', data.idToken); // Speichere den Token in sessionStorage


                    window.location.href = "../html/summary.html";
                } else {
                    throw new Error("Registrierung fehlgeschlagen: Kein Token erhalten");
                }
            })
            .catch(error => {
                console.error("Fehler bei der Registrierung:", error.message);
            });
    }
});

function createDataFb(name, emailValue, token, uid) {
    let number = generateRandomNumber();
    let path = `/user/task${number}`;


    fetch(getDatabaseUrl(path, token), {
        method: 'PUT', // Verwende PUT, um einen neuen Knoten zu erstellen oder einen bestehenden zu überschreiben
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: emailValue,
            uid: uid
        })
    })

}

function generateRandomNumber() {
    let number = '';
    for (let i = 0; i < 6; i++) {
        let digit;
        do {
            digit = Math.floor(Math.random() * 10);
        } while (digit === 0);
        number += digit;
    }
    return number;
}

function getDatabaseUrl(path, token) {
    let base_Url = 'https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app'
    return `${base_Url}${path}.json?auth=${token}`; // URL für die Datenbank zurückgeben
}
