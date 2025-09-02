/**
 * Validates the user input from the form.
 * Checks the validity of the name, email, passwords, and privacy policy agreement.
 * If all validations pass, the submit button is enabled; otherwise, it is disabled.
 */
function validateForm() {
    let userName = document.getElementById('name');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let privacyPolicy = document.getElementById('privacyPolicy');
    let submitButton = document.getElementById('submitButton');
    let isNameValid = validateName(userName.value.trim());
    let isEmailValid = validateEmail(email.value.trim());
    let isPasswordValid = validatePasswords(password.value.trim(), confirmPassword.value.trim());
    let isPrivacyPolicyChecked = privacyPolicy.checked;
    if (isNameValid && isEmailValid && isPasswordValid && isPrivacyPolicyChecked) {
        enableSubmitButton(submitButton);
    } else {
        disableSubmitButton(submitButton);
    }
}

/**
 * Validates a given name against a specific regex pattern.
 * The name must consist of alphabetic characters (including German umlauts) 
 * and may include spaces between words.
 */
function validateName(name) {
    let nameRegex = /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/;
    return nameRegex.test(name);
}

/**
 * Validates a given email address against a specific regex pattern.
 * The email must follow standard formatting rules and end with a valid domain.
 */
function validateEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    return emailRegex.test(email);
}

/**
 * Validates if the provided passwords match and are not empty.
 */
function validatePasswords(password, confirmPassword) {
    return password && confirmPassword && password === confirmPassword;
}

/**
 * Enables the specified submit button and adds a 'login' class to it.
 */
function enableSubmitButton(button) {
    button.disabled = false;
    button.classList.add('login');
}

/**
 * Disables the specified submit button and removes the 'login' class from it.
 */
function disableSubmitButton(button) {
    button.disabled = true;
    button.classList.remove('login');
}


/**
 * Handles the user registration process.
 * This function prevents the default form submission, retrieves user input values,
 * and sends a registration request to the Firebase authentication API. 
 * If successful, it stores the authentication token and redirects to a summary page.
 */
async function handleRegistration(event) {
    event.preventDefault();
    let userName = document.getElementById('name').value;
    let emailValue = document.getElementById('email').value;
    let passwordValue = document.getElementById('password').value;debugger;
    try {
        let response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBUvClF-GJEiTg298gzQneyv8i5Rg9KgQs', {
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

/**
 * Initializes event listeners for the registration form.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('password').addEventListener('input', validateForm);
    document.getElementById('confirmPassword').addEventListener('input', validateForm);
    document.getElementById('email').addEventListener('input', validateForm);
    document.getElementById('privacyPolicy').addEventListener('change', validateForm);
    document.getElementById('name').addEventListener('input', validateForm);
    document.getElementById('registrationForm').addEventListener('submit', handleRegistration);
});

/**
 * Creates a new user entry in the Firebase database.
 */
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
                uid: uid,
                pathNumber: number
            })
        });
        if (!response.ok) {
            throw new Error(`Fehler beim Speichern der Daten: ${response.status} ${response.statusText}`);
        }
        let data = await response.json();

    } catch (error) {
    }
}

/**
 * Generates a random 6-digit number.
 */
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

/**
 * Constructs the full URL for accessing the Firebase Realtime Database.
 */
function getDatabaseUrl(path, token) {
     let base_Url = 'https://join-e54a3-default-rtdb.europe-west1.firebasedatabase.app';
    return `${base_Url}${path}.json?auth=${token}`;
}

/**
 * Validates the input for the name field.
 */
function nameInputVali() {
    let name = document.getElementById('name');
    let failtext = document.getElementById('failName');
    let nameRegex = /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/;
    if (name.value.trim() != '') {
        name.classList.remove('failinput');
        failtext.classList.add('d_none')
    }
    if (!nameRegex.test(name.value.trim())) {
        name.classList.add('failinput');
        failtext.classList.remove('d_none')
    }
}

/**
 * Validates the input for the email field.
 */
function emailInputVali() {
    let email = document.getElementById('email');
    let failtext = document.getElementById('failEmail');
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    if (email.value.trim() != '') {
        email.classList.remove('failinput');
        failtext.classList.add('d_none')
    }
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add('failinput');
        failtext.classList.remove('d_none')
    }
}

/**
 * Validates the input for the password and confirm password fields.
 */
function passwordInputVali() {
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    let failtext = document.getElementById('failPassword');
    if (password.value.trim() === confirmPassword.value.trim()) {
        confirmPassword.classList.remove('failinput');
        failtext.classList.add('d_none')
    } else {
        confirmPassword.classList.add('failinput');
        failtext.classList.remove('d_none')
    }
}