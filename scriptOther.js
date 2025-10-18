

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
                <div id="incorrectName" class="fail hide"><span>Please enter a correct Name</span></div>
                <input type="email" id="userEmail" disabled>
                <div id="incorrectEmail" class="fail hide"><span>Please enter a correct Email</span></div>
                <input type="tel" id="userPhone" disabled>
                  <div id="incorrectPhone" class="fail hide"><span>Please enter a correct number, just a number.</span></div>
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
        checkingInputs();
        if (inputValid) await saveContact();
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

function checkingInputs(){
    let userName = document.getElementById('userName').value;
    let userEmail = document.getElementById('userEmail').value;
    let userPhone = document.getElementById('userPhone').value;
    inputValid = true;
    if (!isCorrect(userName, /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/)) incorrectEntry('name');
    if (!isCorrect(userEmail, /^$|^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,62}[a-zA-Z0-9])?@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/)) incorrectEntry('email');
    if (!isCorrect(userPhone, /^$|^[0-9]+$/)) incorrectEntry('phone');
}


/**
 * @returns {boolean} - Returns true if the input matches the regex; otherwise, false.
 */
function isCorrect(input, regex) { return regex.test(input); }

function incorrectEntry(type) {
    let incorrectName = document.getElementById('incorrectName');
    let incorrectEmail = document.getElementById('incorrectEmail');
    let incorrectPhone = document.getElementById('incorrectPhone');
    if (type === 'name') incorrectName.classList.remove('hide');
    if (type === 'email') incorrectEmail.classList.remove('hide');
    if (type === 'phone') incorrectPhone.classList.remove('hide');
    inputValid = false;
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
    document.getElementById('incorrectName').classList.add('hide');
    document.getElementById('incorrectEmail').classList.add('hide');
    document.getElementById('incorrectPhone').classList.add('hide');
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
    if (userObject.length > 0 && userObject[0].pathNumber == 'guest') await deleteGuest();
    else if (userObject.length > 0) {
        await deleteUser(`/user/task${userObject[0].pathNumber}`);
        await logout();
    } else await logout();
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
