function validateForm() {
    let userName = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let privacyPolicy = document.getElementById('privacyPolicy');
    let submitButton = document.getElementById('submitButton');    
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    let nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

    if (!nameRegex.test(userName.value)) {
        submitButton.disabled = true;
        document.getElementById('submitButton').classList.remove('login');
        return false;
    }

    if (!emailRegex.test(email.value)) {
        submitButton.disabled = true;
        document.getElementById('submitButton').classList.remove('login');
        return false;
    }

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
        document.getElementById('submitButton').classList.remove('login');
    }
}

async function handleRegistration(event) {
    event.preventDefault();
    let userName = document.getElementById('name').value;
    let emailValue = document.getElementById('email').value;
    let passwordValue = document.getElementById('password').value;
    try {
        let response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
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

        let data = await response.json();
        if (data.idToken && data.localId) {
            let token = data.idToken;
            let uid = data.localId;
            await createDataFb(userName, emailValue, token, uid);
            sessionStorage.setItem('authToken', token);
            window.location.href = "../html/summary.html";
        } else {
            throw new Error("Registrierung fehlgeschlagen: Kein Token oder UID erhalten");
        }
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {    
    document.getElementById('password').addEventListener('input', validateForm);
    document.getElementById('confirmPassword').addEventListener('input', validateForm);
    document.getElementById('email').addEventListener('input', validateForm);
    document.getElementById('privacyPolicy').addEventListener('change', validateForm);
    document.getElementById('name').addEventListener('input', validateForm);    
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
});

async function createDataFb(name, emailValue, token, uid) {
    let number = generateRandomNumber();
    let path = `/user/task${number}`;
    try {
        let response = await fetch(getDatabaseUrl(path, token), {
            method: 'PUT',
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
        let data = await response.json();
        
    } catch (error) {        
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