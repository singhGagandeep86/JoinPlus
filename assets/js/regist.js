/**
 * Validates the user input from the form.
 * Checks the validity of the name, email, passwords, and privacy policy agreement.
 * If all validations pass, the submit button is enabled; otherwise, it is disabled.
 *
 * @function validateForm
 * @returns {void}
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
 *
 * @function validateName
 * @param {string} name - The name to validate.
 * @returns {boolean} True if the name is valid, false otherwise.
 */
function validateName(name) {
    let nameRegex = /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/;
    return nameRegex.test(name);
}

/**
 * Validates a given email address against a specific regex pattern.
 * The email must follow standard formatting rules and end with a valid domain.
 *
 * @function validateEmail
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    return emailRegex.test(email);
}

/**
 * Validates if the provided passwords match and are not empty.
 *
 * @function validatePasswords
 * @param {string} password - The first password to validate.
 * @param {string} confirmPassword - The password to confirm against the first.
 * @returns {boolean} True if the passwords match and are not empty, false otherwise.
 */
function validatePasswords(password, confirmPassword) {
    return password && confirmPassword && password === confirmPassword;
}

/**
 * Enables the specified submit button and adds a 'login' class to it.
 *
 * @function enableSubmitButton
 * @param {HTMLButtonElement} button - The button to enable.
 * @returns {void}
 */
function enableSubmitButton(button) {
    button.disabled = false;
    button.classList.add('login');
}

/**
 * Disables the specified submit button and removes the 'login' class from it.
 *
 * @function disableSubmitButton
 * @param {HTMLButtonElement} button - The button to disable.
 * @returns {void}
 */
function disableSubmitButton(button) {
    button.disabled = true;
    button.classList.remove('login');
}


/**
 * Handles the user registration process.
 *
 * This function prevents the default form submission, retrieves user input values,
 * and sends a registration request to the Firebase authentication API. 
 * If successful, it stores the authentication token and redirects to a summary page.
 *
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the registration process is complete.
 */
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

/**
 * Initializes event listeners for the registration form.
 *
 * This function is called when the DOM content is fully loaded. It attaches input and change
 * event listeners to form fields to validate user input and to handle the form submission.
 * 
 * The following event listeners are set up:
 * - 'input' on the password, confirm password, email, and name fields to validate the form in real-time.
 * - 'change' on the privacy policy checkbox to validate the form.
 * - 'submit' on the registration form to handle registration on form submission.
 *
 * @returns {void}
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
 *
 * This function generates a random number to create a unique path for storing user data,
 * and sends a PUT request to save the user's name, email, and UID in the database.
 *
 * @param {string} name - The name of the user.
 * @param {string} emailValue - The email address of the user.
 * @param {string} token - The authentication token for accessing the database.
 * @param {string} uid - The unique identifier for the user.
 * @returns {Promise<void>} A promise that resolves when the data is successfully saved.
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

/**
 * Generates a random 6-digit number.
 *
 * This function creates a string representation of a 6-digit number,
 * ensuring that no digit is zero. Each digit is generated randomly.
 *
 * @returns {string} A string representing a 6-digit number, with no leading zeros.
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
 *
 * This function takes a path and an authentication token to generate
 * a complete URL for making requests to the Firebase database.
 *
 * @param {string} path - The path in the database where the data is located or will be stored.
 * @param {string} token - The authentication token for accessing the database.
 * @returns {string} The complete URL for the database request.
 */
function getDatabaseUrl(path, token) {
    let base_Url = 'https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app';
    return `${base_Url}${path}.json?auth=${token}`;
}

/**
 * Validates the input for the name field.
 *
 * This function checks the value of the name input field against a regular expression
 * to ensure it contains only valid characters (letters and spaces). If the input is valid,
 * it removes the error styles and hides the failure message. If the input is invalid,
 * it applies error styles and displays the failure message.
 *
 * @returns {void}
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
 *
 * This function checks the value of the email input field against a regular expression
 * to ensure it matches a valid email format. If the input is valid, it removes the error
 * styles and hides the failure message. If the input is invalid, it applies error styles
 * and displays the failure message.
 *
 * @returns {void}
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
 *
 * This function checks if the values of the password and confirm password fields match.
 * If they match, it removes the error styles from the confirm password field and hides
 * the failure message. If they do not match, it applies error styles to the confirm
 * password field and displays the failure message.
 *
 * @returns {void}
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