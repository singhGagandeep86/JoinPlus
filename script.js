let userData = [];
let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Handles the login event. 
 * This function prevents the default event behavior, extracts the email and password from the form,
 * validates the inputs, and sends a request to the authentication API.
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
 */
function capitalizeName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Updates the inner HTML of the greeting element with the user's name.
 * @param {string} replaceElement - The name to display in the greeting.
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
 * @param {string} userInitial - The initials of the user.
 * @param {string} guest - The identifier for guest users.
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
 */
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches the user ID (UID) associated with the current authentication token 
 * and stores it in session storage if it is not already present.
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
 */
function errorLogin() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('passwordInput').classList.add('falseEnter');
    document.getElementById('fail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}

/**
 * Handles email validation errors by providing visual feedback to the user.
 */
function valiEmail() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('emailFail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}

/**
 * Resets validation feedback for email and password input fields.
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