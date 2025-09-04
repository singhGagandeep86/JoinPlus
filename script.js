
let userData = [];
let BASE_URL = "https://join-e54a3-default-rtdb.europe-west1.firebasedatabase.app/";


/**
 * Retrieves the email and password from the event target.
 * @param {Event} event - The event whose target contains the email and password input fields.
 * @returns {Object} - An object with properties "email" and "password".
 */
function getEmailAndPassword(event) {
    const email = event.target.email.value;
    const password = event.target.password.value;
    return { email, password };
}


/**
 * Validates user credentials (email and password) before sending an authentication request.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {boolean} - Whether the credentials are valid.
 */
function validateCredentials(email, password) {
    return loginVali(email, password);
}


/**
 * Sends an authentication request to the Firebase Authentication API with the specified email and password.
 * @returns {Promise<Response>} - The response object from the API after sending the request.
 */
function fetchAuthToken(email, password) {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBUvClF-GJEiTg298gzQneyv8i5Rg9KgQs', {
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


/**
 * Processes the response from an API request.
 * @param {Response} response - The response object to process.
 * @returns {Promise<Object>} - The parsed JSON object from the response body.
 */
function processResponse(response) {
    if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
    return response.json();
}


/**
 * Handles a successful login response from the API.
 * @param {Object} data - The response object from the API containing the authentication token.
 * @returns {void}
 */
function handleSuccessfulLogin(data) {
    if (data.idToken) {
        sessionStorage.setItem('authToken', data.idToken);
        window.location.href = "assets/html/summary.html";
    } else {
    }
}


/**
 * Handles an error response from the login API by calling the errorLogin function.
 * @returns {void}
 */
function handleLoginError() {
    errorLogin();
}


/**
 * Handles the login form submission by retrieving the user's email and password, validating the
 * credentials, and sending an authentication request to the Firebase Authentication API.
 * @param {Event} event - The event object from the form submission.
 * @returns {void}
 */
function handleLogin(event) {
    event.preventDefault();
    let { email, password } = getEmailAndPassword(event);
    if (validateCredentials(email, password)) {
        fetchAuthToken(email, password)
            .then(processResponse)
            .then(handleSuccessfulLogin)
            .catch(handleLoginError);
        handleLoginError();
    }
}


/**
 * Returns the configuration object for the guest login request to the Firebase Authentication API.
 * @returns {Object} - The configuration object.
 */
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


/**
 * Fetches an authentication token for a guest user by sending a sign-up request
 * to the Firebase Authentication API. Utilizes the configuration from
 * `getGuestAuthConfig` to ensure the request is properly formatted.
 * @returns {Promise<Response>} - A promise that resolves to the response of the fetch request.
 */
function fetchGuestAuthToken() {
    return fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBUvClF-GJEiTg298gzQneyv8i5Rg9KgQs', getGuestAuthConfig());
}


/**
 * Processes the response from a guest login request to the Firebase Authentication API.
 * @param {Response} response - The response object from the API.
 * @returns {Promise<Object>} - The parsed JSON object from the response body.
 */
function processGuestResponse(response) {
    if (!response.ok) {
        throw new Error(`Fehler: ${response.status} ${response.statusText}`);
    }
    return response.json();
}


/**
 * Extracts the authentication token from the response of a guest login request to the
 * @param {Object} data - The parsed JSON object from the response body.
 * @returns {string} - The authentication token.
 */
function extractGuestToken(data) {
    if (data.idToken) {
        return data.idToken;
    } else {
        throw new Error("Fehler bei der anonymen Authentifizierung: kein Token erhalten");
    }
}


/**
 * Initiates the guest login process by fetching an authentication token from the Firebase Authentication API.
 * @returns {Promise<string>} - A promise that resolves to the extracted authentication token.
 */
function loginGuest() {
    return fetchGuestAuthToken()
        .then(processGuestResponse) // Antwortverarbeitung
        .then(extractGuestToken);   // Token-Extraktion
}



/**
 * Initiates a guest login by fetching an authentication token from the Firebase Authentication API and storing it
 * in session storage. If the token is valid, it redirects to the summary page.
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

function deleteGuest() {
    let userObject = userData.filter(e => e['pathNumber'] === 'guest');
    if (userObject == '') {
        logout();
    } else if (userObject[0].pathNumber == 'guest') {
        deleteUser(`/user/guest`);
        logout();
    } else {
        logout();
    }
}


/**
 * Logs the user out by removing the authentication token and user ID from session storage, and resets the user data array.
 * Redirects to the login page.
 */
async function logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('uid');
    userData = [];
    window.location.href = "../../index.html";
}


/**
 * Loads and initializes the user data from session storage.
 * @returns {Promise<void>}
 */
async function loadInitailUser() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    loadInitailUserIf(userObject);
}

/**
 * Checks if the user data is empty and creates a guest user if so.
 * @param {string} userId - The user ID from session storage.
 * @param {Array} userObject - The user data array from session storage.
 */
function loadInitailUserIf(userObject) {
    if (userObject == '') {
        let guest = 'GS'
        createUser(guest, userObject);
        writeGreetinGuest(userObject)
    } else {
        for (let i = 0; i < userObject.length; i++) {
            let element = userObject[i].name;
            let userInitial = extrahiereInitialen(element)
            let replaceElement = capitalizeName(element)
            createUser(userInitial, userObject);
            writeGreetin(replaceElement, userObject);
        }
    }
}


/**
 * Capitalizes the first letter of each word in a string and
 * @param {string} name - The string to capitalize.
 * @returns {string} The capitalized string.
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
 * Updates the inner HTML of the greeting element with 'Guest User' if the user is a guest.
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
function createUser(userInitial, userObject) {
    let userInitials = document.getElementById('userIni');
    if (!userObject || userObject.length === 0) {
        userInitials.innerText = `${userInitial}`;
    } else if (userObject[0].pic) {
        userInitials.classList.add('d_none');
        document.getElementById('userPic').classList.remove('d_none');
        document.getElementById('userPic').src = userObject[0].pic;
    } else {
        userInitials.innerText = `${userInitial}`;
    }
}


/**
 * Extracts the initials from a given name.
 * @param {string} element - The full name from which to extract initials.
 * @returns {string} - The extracted initials, with each initial capitalized.
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
 * Fetches the user data from the specified path and loads the user's data into the user data array.
 * @param {string} path - The database path from which to fetch the user data.
 * @returns {Promise<void>}
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
 * Constructs the full URL for accessing the database using the given path.
 * @param {string} path - The specific path to the database resource.
 * @returns {string} The complete URL with the authentication token.
 */
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches the user ID (UID) from the Firebase authentication API.
 * @returns {Promise<string>} The user's UID if the request is successful.
 */
async function fetchUID() {
    let token = sessionStorage.getItem('authToken');
    let response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBUvClF-GJEiTg298gzQneyv8i5Rg9KgQs`, {
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

/**
 * Checks if the user ID (UID) is already stored in sessionStorage.
 * @returns {Promise<void>} Resolves when the UID is successfully stored or already present.
 */
async function fetchAndStoreUID() {
    if (!sessionStorage.getItem('uid')) {
        let uid = await fetchUID();
        sessionStorage.setItem('uid', uid);
    }
}


/**
 * Handles login errors by providing visual feedback to the user.
 * Resets the password input field to empty.
 */
function errorLogin() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('passwordInput').classList.add('falseEnter');
    document.getElementById('fail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}


/**
 * Adds a red border to the email input field and makes the error message visible.
 * Resets the password input field to empty.
 */
function valiEmail() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('emailFail').classList.remove('d_none');
    document.getElementById('passwordInput').value = '';
}


/**
 * Resets the error visual feedback after a successful login.
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
 * @param {string} email the email input by the user
 * @param {string} password the password input by the user
 * @returns {bool} true if the inputs are valid, false otherwise
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

function getOperator(userObject) {
    let initialsCont = document.getElementById('initialCont');
    let userImg = document.getElementById('userImg');
    for (let i = 0; i < userObject.length; i++) {
        let userName = userObject[i].name;
        let userEmail = userObject[i].email;
        let userPhone = userObject[i].phone;
        let userInitial = extrahiereInitialen(userName); 
        let profilePic = userObject[i].pic;
        if (profilePic) {
            userImg.classList.remove('d_none');
            userImg.src = profilePic;
        } else {
            initialsCont.innerText = `${userInitial}`;
        }
        document.getElementById('userName').value = userName;
        document.getElementById('userEmail').value = userEmail;
        document.getElementById('userPhone').value = userPhone;
    }
}