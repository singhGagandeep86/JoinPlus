document.addEventListener('DOMContentLoaded', () => {
    let userName = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let privacyPolicy = document.getElementById('privacyPolicy');
    let submitButton = document.getElementById('submitButton');

    // Funktion, um den Button nur zu aktivieren, wenn alles korrekt ist
    function validateForm() {
        if (
            password.value &&
            confirmPassword.value &&
            password.value === confirmPassword.value &&
            privacyPolicy.checked &&
            userName.value.trim() !== ''
        ) {
            submitButton.disabled = false;
            document.getElementById('submitButton').classList.add('login');
        } else {
            submitButton.disabled = true;
        }
    }

    // Überprüfe die Formulardaten
    password.addEventListener('input', validateForm);
    confirmPassword.addEventListener('input', validateForm);
    privacyPolicy.addEventListener('change', validateForm);

    // Registrierungs-Event-Listener
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);

    async function handleRegistration(event) {
        event.preventDefault(); // Verhindert das Standard-Formularverhalten

        let name = userName.value;
        let emailValue = email.value;
        let passwordValue = password.value;

        try {
            // Firebase REST API für die Registrierung
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailValue,
                    password: passwordValue,
                    returnSecureToken: true
                })
            });

            if (!response.ok) {
                throw new Error(`Fehler: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.idToken && data.localId) {
                let token = data.idToken;
                let uid = data.localId;

                // Nun warten wir, bis die Daten sicher in der Realtime Database gespeichert sind
                await createDataFb(name, emailValue, token, uid);

                // Token im sessionStorage speichern
                sessionStorage.setItem('authToken', token);

                // Weiterleitung zur nächsten Seite
                window.location.href = "../html/summary.html";
            } else {
                throw new Error("Registrierung fehlgeschlagen: Kein Token oder UID erhalten");
            }
        } catch (error) {
            console.error("Fehler bei der Registrierung:", error.message);
        }
    }
});

async function createDataFb(name, emailValue, token, uid) {
    let number = generateRandomNumber();
    let path = `/user/task${number}`;

    try {
        const response = await fetch(getDatabaseUrl(path, token), {
            method: 'PUT', // Verwende PUT, um einen neuen Knoten zu erstellen oder einen bestehenden zu überschreiben
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: emailValue,
                uid: uid
            })
        });

        if (!response.ok) {
            throw new Error(`Fehler beim Speichern der Daten: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Erfolgreich in der Realtime Database gespeichert:", data);
    } catch (error) {
        console.error("Fehler bei der Speicherung in der Realtime Database:", error.message);
    }
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
    let base_Url = 'https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app';
    return `${base_Url}${path}.json?auth=${token}`;
}
