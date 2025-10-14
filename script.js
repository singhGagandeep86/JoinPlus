
let userData = [];
let BASE_URL = "https://join-e54a3-default-rtdb.europe-west1.firebasedatabase.app/";
let editContactMode = false;
let allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

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
            .catch(handleLoginError)
            .finally(() => {
                handleLoginError();
            })
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

/**
 * Deletes the current guest user and logs them out.
 * If the user is a guest user, deletes the user data from the database and logs them out.
 * If the user is not a guest user, logs them out without deleting the user data.
 */
async function deleteGuest() {
    let userObject = userData.filter(e => e['pathNumber'] === 'guest');
    if (userObject.length === 0) {
        await logout();
    } else if (userObject[0].pathNumber == 'guest') {
        await deleteUser(`/user/guest`);
        await logout();
    } else {
        await logout();
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
    if (userObject.length === 0) {
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
    let url = `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}.json?auth=${token}`;
    return url;
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
    document.getElementById('fail').classList.remove('hide');
    document.getElementById('passwordInput').value = '';
}

/**
 * Adds a red border to the email input field and makes the error message visible.
 * Resets the password input field to empty.
 */
function valiEmail() {
    document.getElementById('emailInput').classList.add('falseEnter');
    document.getElementById('emailFail').classList.remove('hide');
    document.getElementById('passwordInput').value = '';
}

/**
 * Resets the error visual feedback after a successful login.
 */
function returnInput() {
    if (document.getElementById('emailInput').length != 0 || document.getElementById('emailInput').value == '') {
        document.getElementById('emailInput').classList.remove('falseEnter');
        document.getElementById('passwordInput').classList.remove('falseEnter');
        document.getElementById('fail').classList.add('hide');
        document.getElementById('emailFail').classList.add('hide');
    }
}

/**
 * @param {string} email the email input by the user
 * @param {string} password the password input by the user
 * @returns {bool} true if the inputs are valid, false otherwise
 */
function loginVali(email, password) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email && !password) {
        errorLogin();
        return false;
    }
    if (!emailRegex.test(email)) {
        valiEmail();
        return false;
    }
    return true;
}

/**
 * Retrieves the operator's initials and image from the user data array.
 * Iterates over the user data array and calls the issueValues function for each item.
 * @param {Array} userObject - The array containing user data objects.
 */
function getOperator(userObject) {
    let initialCont = document.getElementById('initialCont');
    let userImg = document.getElementById('userImg');
    for (let i = 0; i < userObject.length; i++) {
        issueValues(i, initialCont, userImg, userObject);
    }
}

/**
 * Issues the user's initials and image to the DOM.
 * @param {number} i - The index of the user data object in the user data array.
 * @param {Element} initialsCont - The element to display the user's initials.
 * @param {Element} userImg - The element to display the user's profile picture.
 */
function issueValues(i, initialCont, userImg, userObject) {
    let userName = userObject[i].name;
    let userEmail = userObject[i].email;
    let userPhone = userObject[i].phone;
    let userInitial = extrahiereInitialen(userName);
    let profilePic = userObject[i].pic;
    if (profilePic) {
        userImg.classList.remove('d_none');
        userImg.src = profilePic;
    } else {
        initialCont.innerHTML = `${userInitial}`;
    }
    document.getElementById('userName').value = userName;
    document.getElementById('userEmail').value = userEmail;
    document.getElementById('userPhone').value = userPhone;
}

/**
 * Closes the edit contact popup.
 */
function closeContact() {
    document.getElementById('popupContact').classList.add('d_none');
    document.body.style.overflow = '';
}

/**
 * Opens the edit contact popup and fills it with the user's data.
 * Retrieves the user data from the user data array and calls the getOperator function to fill the popup with the user's data.
 * If the user data array is empty, a default user object is created and used to fill the popup.
 */
function openContact() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    let contactPopUp = document.getElementById('popupContact');
    if (userObject.length === 0) {
        userObject = [{
            "email": "",
            "name": "Guest User",
            "uid": userId,
            "pathNumber": "",
            "phone": ""
        }]
    }
    contactPopUp.classList.remove('d_none');
    document.body.style.overflow = 'hidden';
    contactPopUp.innerHTML = editContactTemp();
    getOperator(userObject);
}

/**
 * Generates an HTML template for editing a contact, with an input field prefilled with the current contact value.
 * @returns {string} - The HTML string for the edit contact popup.
 */
function editContactTemp() {
    return `  <div class="editContact" onclick="event.stopPropagation()">
        <div class="left-part">
            <img src="../img/Joinlogowhite.png">
            <h2 id="title">My account</h2>
            <div class="vector"></div>
        </div>
        <div class="right-part">
            <img onclick="closeContact()" class="close" src="../img/Close.png">
            <div class="initialsContMain">
                <span id="initialCont"></span>
                <img id="userImg" class="userImg d_none">
                <div id="camera" class="camera d_none" onclick="openUserImgPicker()">
                    <input id="userImgPicker" type="file" style="display: none;" accept="image/JPEG, image/PNG">
                    <img src="../img/camera.png">
                </div>
            </div>
            <div class="userDetails">
                <input type="text" id="userName" disabled>
                <input type="email" id="userEmail" disabled>
                <input type="tel" id="userPhone" disabled>
                <div class="buttonContainer">
                    <button onclick="deleteCurrentUser()">Delete my account</button>
                    <button id="editButton" onclick="editUser()">Edit</button>
                </div>
            </div>
        </div>
    </div>
`
}

/**
 * Toggles the edit mode for the user account.
 * If not in edit mode, it will enable the text fields and the camera button, and change the edit button to a save button.
 * If in edit mode, it will save the changes and disable the text fields and the camera button, and change the edit button back to an edit button.
 */
async function editUser() {
    if (!editContactMode) {
        document.getElementById('title').innerHTML = 'Edit account';
        document.getElementById('editButton').innerHTML = `Save <img src="../img/check.svg">`;
        document.getElementById('camera').classList.remove('d_none');
        document.getElementById('userName').removeAttribute('disabled');
        document.getElementById('userName').focus();
        document.getElementById('userEmail').removeAttribute('disabled');
        document.getElementById('userPhone').removeAttribute('disabled');
        editContactMode = true;
    } else {
        await saveContact();
        editContactMode = false;
    }
}

/**
 * Converts a blob to a base64 string.
 * @param {Blob} blob - The blob to be converted.
 * @returns {Promise<string>} - A promise that resolves with the base64 string.
 */
function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

/**
 * Compresses an image file by loading it into an image object, resizing it to the given maximum width and height, and converting it to a base64 string.
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => { resolve(optimiseImage(img, maxWidth, maxHeight, quality)); };
            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };
        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
    });
}

/** Returns a promise that resolves with an object containing the width and height of the image with the given src. */
function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = src;
    });
}

/**
 * Adjusts the size of an image to fit within a given maximum width and height.
 */
function adjustImageSize(width, height, maxWidth, maxHeight) {
    if (width > height) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    } else {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }
    return { width, height };
}

/**
 * Resizes an image to fit within a given maximum width and height, and converts it to a base64 string.
 */
function optimiseImage(img, maxWidth, maxHeight, quality) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    let width = img.width;
    let height = img.height;
    if (width > maxWidth || height > maxHeight) {
        ({ width, height } = adjustImageSize(width, height, maxWidth, maxHeight));
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', quality);
}


/**
 * Opens the user image picker. Checks if the user image picker element exists and if an event listener for the 'change' event has been added.
 * If the event listener has not been added, it adds the event listener and sets a dataset attribute to keep track of it.
 * Finally, it simulates a click on the user image picker element to open it.
 */
function openUserImgPicker() {
    let userImgPicker = document.getElementById('userImgPicker');

    if (!userImgPicker) return;

    if (!userImgPicker.dataset.listener) {
        userImgPicker.addEventListener('change', handleUserImageChange);
        userImgPicker.dataset.listener = "true";
    }

    userImgPicker.click();
}

/**
 * Handles the user image change event, converting the selected image to a base64 string and displaying it in the user image element.
 * @param {Event} event - The change event triggered by the user image picker.
 */
async function handleUserImageChange(event) {
    let userImg = document.getElementById('userImg');
    const file = event.target.files[0];
    if (!file) return;

    const blog = new Blob([file], { type: file.type });

    const base64 = await blobToBase64(blog);

    const img = document.createElement('img');
    img.src = base64;

    document.getElementById('initialCont').classList.add('d_none');
    userImg.classList.remove('d_none');
    userImg.src = base64;
}

/**
 * Saves changes to the user's account.
 * Disables input fields and gets user ID from session storage.
 * If no user exists or path is 'guest' / empty → save to guest endpoint.
 * Otherwise → save to user endpoint with the user's path number.
 */
async function saveContact() {
    let userImg = document.getElementById('userImg');
    disableInputs();
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    if (userObject.length === 0) {
        await postEditData(`/user/guest`, guestAsUserFormat(userImg, userId));
    } else {
        if (userObject[0].pathNumber == 'guest' || userObject[0].pathNumber == '') {
            await postEditData(`/user/guest`, userFormat(userObject, userImg));
        } else {
            await postEditData(`/user/task${userObject[0].pathNumber}`, userFormat(userObject, userImg));
        }
    }
}

/**
 * Disables all input fields and sets the title back to 'My account'.
 * It also hides the camera button and changes the edit button back to 'Edit'.
 */
function disableInputs() {
    document.getElementById('userName').setAttribute("disabled", true);
    document.getElementById('userEmail').setAttribute("disabled", true);
    document.getElementById('userPhone').setAttribute("disabled", true);
    document.getElementById('title').innerHTML = 'My account';
    document.getElementById('editButton').innerHTML = `Edit`;
    document.getElementById('camera').classList.add('d_none');
}

/**
 * Returns an object containing the user's name, email, phone, user ID, path number and profile picture.
 * @param {Array} userObject - The array containing user data objects.
 * @param {Element} userImg - The element containing the user's profile picture.
 * @returns {Object} - An object containing the user's data.
 */
function userFormat(userObject, userImg) {
    return {
        'name': document.getElementById('userName').value,
        'email': document.getElementById('userEmail').value,
        'phone': document.getElementById('userPhone').value,
        'uid': userObject[0].uid,
        'pathNumber': userObject[0].pathNumber,
        'pic': userImg.src
    }
}

/**
 * Returns an object containing the user's name, email, phone, user ID, path number and profile picture for a guest user.
 * @param {Element} userImg - The element containing the user's profile picture.
 * @param {string} userId - The user ID from session storage.
 * @returns {Object} - An object containing the user's data.
 */
function guestAsUserFormat(userImg, userId) {
    return {
        'name': document.getElementById('userName').value,
        'email': document.getElementById('userEmail').value,
        'phone': document.getElementById('userPhone').value,
        'uid': userId,
        'pathNumber': 'guest',
        'pic': userImg.src
    }
}

/**
 * Deletes the current user and logs them out.
 * If the user is a guest user, only logs them out.
 * If the user is not a guest user, deletes the user data from the database and logs them out.
 */
async function deleteCurrentUser() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);

    await saveContact();

    if (userObject.length > 0 && userObject[0].pathNumber == 'guest') {
        await deleteGuest();
    } else if (userObject.length > 0) {
        await deleteUser(`/user/task${userObject[0].pathNumber}`);
        await logout();
    } else {
        await logout();
    }
}

/**
 * Sends a PATCH request to update data at the specified path.
 */
async function postEditData(path = "", data = {}) {
    let response = await fetch(getDatabaseUrl(path), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error("Speichern fehlgeschlagen!");
    }

    await loadnewTaskEdit();
    return response;
}

/**
 * Deletes a user from the Firebase database based on the provided path.
 */
async function deleteUser(path = "") {
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "DELETE"
    });
}

/** Loads new task data and refreshes the display.*/
async function loadnewTaskEdit() {
    fetchUserData('/user');
}


