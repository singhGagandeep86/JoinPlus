let userData = [];
let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";


/** Retrieves the email and password from the event target.*/
function getEmailAndPassword(event) {
    const email = event.target.email.value;
    const password = event.target.password.value;
    return { email, password };
}


/** Validates user credentials (email and password) before sending an authentication request.*/
function validateCredentials(email, password) {
    return loginVali(email, password);
}


/** Sends an authentication request to the Firebase Authentication API with the specified email and password.*/
function fetchAuthToken(email, password) {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    });
}


/** Processes the response from an API request.*/
function processResponse(response) {
    if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
    return response.json();
}


/** Handles a successful login response from the API.*/
function handleSuccessfulLogin(data) {
    if (data.idToken) {
        sessionStorage.setItem('authToken', data.idToken);
        window.location.href = "assets/html/summary.html";
    } else {
    }
}


/** Handles an error response from the login API by calling the errorLogin function.*/
function handleLoginError() {
    errorLogin();
}


/** Handles the login form submission by retrieving the user's email and password, validating the
 * credentials, and sending an authentication request to the Firebase Authentication API.*/
function handleLogin(event) {
    event.preventDefault();
    let { email, password } = getEmailAndPassword(event);
    if (validateCredentials(email, password)) {
        fetchAuthToken(email, password)
            .then(processResponse)
            .then(handleSuccessfulLogin)
            .catch(handleLoginError);        
    }
}


/** Returns the configuration object for the guest login request to the Firebase Authentication API.*/
function getGuestAuthConfig() {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            returnSecureToken: true
        })
    };
}


/** Fetches an authentication token for a guest user by sending a sign-up request*/
function fetchGuestAuthToken() {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM', getGuestAuthConfig());
}


/** Processes the response from a guest login request to the Firebase Authentication API.*/
function processGuestResponse(response) {
    if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
    return response.json();
}


/** Extracts the authentication token from the response of a guest login request to the*/
function extractGuestToken(data) {
    if (data.idToken) {
        return data.idToken;
    } else {
        throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
    }
}


/** Initiates the guest login process by fetching an authentication token from the Firebase Authentication API.*/
function loginGuest() {
    return fetchGuestAuthToken()
        .then(processGuestResponse)
        .then(extractGuestToken);  
}


/** Initiates a guest login by fetching an authentication token from the Firebase Authentication API and storing it
 * in session storage. If the token is valid, it redirects to the summary page.*/
function guestLogin() {
    loginGuest().then((token) => {
        if (token) {
            sessionStorage.setItem('authToken', token);
            fetchAndStoreUID();
            window.location.href = "assets/html/summary.html";
        }
    });
}


/** Logs the user out by removing the authentication token and user ID from session storage, and resets the user data array.
 * Redirects to the login page.*/
function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('uid');
    userData = [];
    window.location.href = "../../index.html";
}


/** Loads and initializes the user data from session storage.*/
async function loadInitailUser() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    loadInitailUserIf(userId, userObject);
}

/** Checks if the user data is empty and creates a guest user if so.*/
function loadInitailUserIf(userId, userObject) {
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
        }}
}


/** Capitalizes the first letter of each word in a string and*/
function capitalizeName(name) {
    return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/** Updates the inner HTML of the greeting element with the user's name.*/
function writeGreetin(replaceElement, userObject) {
    let nameGreeting = document.getElementById('greetingName');
    if (nameGreeting == null) {
    } else {
        nameGreeting.innerHTML = replaceElement;
    }
}


/** Updates the inner HTML of the greeting element with 'Guest User' if the user is a guest.*/
function writeGreetinGuest() {
    let nameGreeting = document.getElementById('greetingName');
    if (nameGreeting == null) {

    } else {
        nameGreeting.innerHTML = 'Guest User'
    }
}

/** Updates the user initials display based on the provided parameters.*/
function createUser(userInitial, guest, userObject) {
    let userInitials = document.getElementById('userIni');
    if (userObject == '') {
        userInitials.innerText = guest;
    } else {
        userInitials.innerText = `${userInitial}`;
    }
}


/** Extracts the initials from a given name.*/
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


/** Fetches the user data from the specified path and loads the user's data into the user data array.*/
async function fetchUserData(path) {
    let response = await fetch(getDatabaseUrl(path));
    let responsetoJson = await response.json();
    let taskArray = Object.values(responsetoJson);
    for (let i = 0; i < taskArray.length; i++) {
        userData.push(taskArray[i]);
    }
    loadInitailUser();
}


/** Constructs the full URL for accessing the database using the given path.*/
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/** Fetches the user ID (UID) from the Firebase authentication API.*/
async function fetchUID() {
    let token = sessionStorage.getItem('authToken');
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
    return data.users[0].localId;
}

/** Checks if the user ID (UID) is already stored in sessionStorage.*/
async function fetchAndStoreUID() {
    if (!sessionStorage.getItem('uid')) {
        let uid = await fetchUID();
        sessionStorage.setItem('uid', uid);
    }
}


/** Handles login errors by providing visual feedback to the user.
 * Resets the password input field to empty.*/
function errorLogin() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('passwordInput').classList.add('falseEnter');
    document.getElementById('fail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}


/** Adds a red border to the email input field and makes the error message visible.
 *  Resets the password input field to empty.*/
function valiEmail() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('emailFail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}


/** Resets the error visual feedback after a successful login.*/
function returnInput() {
    if (document.getElementById('emailInput').length != 0 || document.getElementById('emailInput').value == '') {
        document.getElementById('emailInput').classList.remove('falseEnter');
        document.getElementById('passwordInput').classList.remove('falseEnter');
        document.getElementById('fail').classList.add('d_none');
        document.getElementById('emailFail').classList.add('d_none');
    }
}


/** email and password test of true enter input*/
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