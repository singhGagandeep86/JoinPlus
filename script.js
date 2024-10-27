let userData = [];
let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Handles the login event.
 *
 * This function prevents the default event behavior, extracts the email and password from the form,
 * validates the inputs, and sends a request to the authentication API.
 * On successful login, it stores the token in sessionStorage and redirects the user to the summary page.
 *
 * @param {Event} event - The event object from the login form.
 * @returns {void}
 *
 * @throws {Error} If the login request fails or no token is returned.
 */
function handleLogin(event) {
    event.preventDefault();
    let email = event.target.email.value;
    let password = event.target.password.value;
    if(loginVali(email, password)){
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

                sessionStorage.setItem('authToken', data.idToken);
                window.location.href = "assets/html/summary.html";
            } else {
                throw new Error("Anmeldung fehlgeschlagen: Kein Token erhalten");
            }
        })
        .catch(error => {

            errorLogin();
        });
    }
}

/**
 * Logs in a guest user by creating a new anonymous account.
 *
 * This function sends a request to the authentication API to sign up
 * a guest user and returns the ID token if the request is successful.
 *
 * @returns {Promise<string>} A promise that resolves to the ID token of the guest user.
 *
 * @throws {Error} If the signup request fails or no token is received.
 */
function loginGuest() {
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
                return data.idToken;
            } else {
                throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
            }
        })
}

/**
 * Handles guest login by calling the loginGuest function to obtain a token.
 * If a token is received, it stores the token in session storage,
 * fetches and stores the user ID, and then redirects the user to the summary page.
 *
 * @function guestLogin
 * @returns {Promise<void>} A promise that resolves when the guest login process is complete.
 */
function guestLogin() {
    loginGuest().then((token) => {
        if (token) {
            sessionStorage.setItem('authToken', token);
            fetchAndStoreUID();
            window.location.href = "assets/html/summary.html";
        }
    });
}

/**
 * Logs out the user by removing authentication and user data from session storage.
 * It then redirects the user to the homepage.
 *
 * @function logout
 * @returns {void}
 */
function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('uid');
    userData = [];
    window.location.href = "../../index.html";
}

/**
 * Loads the initial user based on the user ID stored in session storage.
 * If no user is found, it creates a guest user and writes a greeting.
 * If a user is found, it extracts the user's initials, capitalizes the name,
 * and writes a personalized greeting.
 *
 * @async
 * @function loadInitialUser
 * @returns {Promise<void>} A promise that resolves when the user loading process is complete.
 */
async function loadInitailUser() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    if (userObject == '') {
        let guest = 'GS'
        createUser(guest, userObject);
        writeGreetinGuest(userObject)
    } else {
        for (let i = 0; i < userObject.length; i++) {
            let element = userObject[i].name;
            let userInitial = extrahiereInitialen(element)
            let replaceElement = capitalizeName(element)
            createUser(userInitial);
            writeGreetin(replaceElement, userObject);
        }
    }
}

/**
 * Capitalizes the first letter of each word in a given name and converts the rest to lowercase.
 *
 * @function capitalizeName
 * @param {string} name - The name to be capitalized.
 * @returns {string} The capitalized version of the name.
 */
function capitalizeName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Updates the inner HTML of the greeting element with the user's name.
 *
 * @function writeGreetin
 * @param {string} replaceElement - The name to display in the greeting.
 * @param {Array} userObject - The user object containing user data.
 */
function writeGreetin(replaceElement, userObject) {
    let nameGreeting = document.getElementById('greetingName');

    if (nameGreeting == null) {

    } else {
        nameGreeting.innerHTML = replaceElement;
    }
}

/**
 * Updates the inner HTML of the greeting element to display "Guest User".
 *
 * @function writeGreetinGuest
 */
function writeGreetinGuest() {
    let nameGreeting = document.getElementById('greetingName');
    if (nameGreeting == null) {

    } else {
        nameGreeting.innerHTML = 'Guest User'
    }
}

/**
 * Updates the user initials display based on the provided parameters.
 *
 * @function createUser
 * @param {string} userInitial - The initials of the user.
 * @param {string} guest - The identifier for guest users.
 * @param {Array} userObject - The array of user objects.
 */
function createUser(userInitial, guest, userObject) {
    let userInitials = document.getElementById('userIni');
    if (userObject == '') {
        userInitials.innerText = guest;
    } else {
        userInitials.innerText = `${userInitial}`;
    }
}

/**
 * Extracts the initials from a given name string.
 *
 * @function extrahiereInitialen
 * @param {string} element - The full name from which to extract initials.
 * @returns {string} The initials of the name, each capitalized.
 */
function extrahiereInitialen(element) {
    for (let i = 0; i < element.length; i++) {
        let nameParts = element.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}

/**
 * Fetches user data from the specified path in the database and loads the initial user information.
 *
 * @async
 * @function fetchUserData
 * @param {string} path - The path to the user data in the database.
 * @returns {Promise<void>} A promise that resolves when the user data has been successfully fetched and loaded.
 */
async function fetchUserData(path) {
    let response = await fetch(getDatabaseUrl(path));
    let responsetoJson = await response.json();
    let taskArray = Object.values(responsetoJson);
    for (let i = 0; i < taskArray.length; i++) {
        userData.push(taskArray[i]);
    }
    loadInitailUser();
}

/**
 * Constructs a URL for accessing the database with the provided path and the current authentication token.
 *
 * @function getDatabaseUrl
 * @param {string} path - The path to the specific resource in the database.
 * @returns {string} The constructed URL for accessing the database.
 */
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches the user ID (UID) associated with the current authentication token 
 * and stores it in session storage if it is not already present.
 *
 * @async
 * @function fetchAndStoreUID
 * @throws {Error} Throws an error if the fetch request fails or if the response does not contain a valid UID.
 */
async function fetchAndStoreUID() {
    let token = sessionStorage.getItem('authToken');
    if (!sessionStorage.getItem('uid')) {
        let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idToken: token
            })
        });
        let data = await response.json();
        let uid = data.users[0].localId;
        sessionStorage.setItem('uid', uid);
    }
}

/**
 * Handles login errors by providing visual feedback to the user.
 * Adds a 'falseEnter' class to the email and password input fields 
 * to indicate that the input was invalid. 
 * Displays an error message and clears the password input field.
 *
 * @function errorLogin
 */
function errorLogin() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('passwordInput').classList.add('falseEnter');
    document.getElementById('fail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}

/**
 * Handles email validation errors by providing visual feedback to the user.
 * Adds a 'falseEnter' class to the email input field to indicate that 
 * the email input is invalid. Displays an error message and clears 
 * the password input field.
 *
 * @function valiEmail
 */
function valiEmail() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('emailFail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}

/**
 * Resets validation feedback for email and password input fields.
 * If the email input is not empty, it removes the 'falseEnter' class
 * from both the email and password input fields and hides any error messages.
 *
 * @function returnInput
 */
function returnInput() {
    if (document.getElementById('emailInput').length != 0 || document.getElementById('emailInput').value == '') {
        document.getElementById('emailInput').classList.remove('falseEnter');
        document.getElementById('passwordInput').classList.remove('falseEnter');
        document.getElementById('fail').classList.add('d_none');
        document.getElementById('emailFail').classList.add('d_none');
    }
}

/**
 * Validates the email and password for login.
 * 
 * This function checks if the email and password fields are filled out and 
 * verifies that the email format is correct using a regular expression.
 * If any of the validations fail, it triggers appropriate error handling 
 * functions (`errorLogin` or `valiEmail`) and returns false. If all checks 
 * pass, it returns true.
 *
 * @param {string} email - The email address to validate.
 * @param {string} password - The password to validate.
 * @returns {boolean} - Returns true if both email and password are valid, 
 *                      otherwise returns false.
 */
function loginVali(email, password) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
    if (!email || !password) {
        errorLogin();
        return false;
    } 
    if (!emailRegex.test(email)) {
        valiEmail();
        return false;
    }  
    return true;
}