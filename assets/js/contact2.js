

/**
 * Marks the name field with an error style and displays the error message
 * when the input for the name is invalid during the editing process.
 */
function failNameEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('failNameEdit').classList.remove('d_none');
}


/**
 * Resets the contact form by removing all input values and
 * clearing the validation messages and error styles. Also
 * hides the overlay.
 */
function reloadAdd() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('name').classList.remove('failinput');
    document.getElementById('email').classList.remove('failinput');
    document.getElementById('phone').classList.remove('failinput');
    document.getElementById('failEmail').classList.add('d_none');
    document.getElementById('failPhone').classList.add('d_none');
    document.getElementById('failName').classList.add('d_none');
    document.getElementById('failAll').classList.add('d_none');
    document.getElementById('overlay').classList.remove('show');
}

/**
 * Clears the error markings in the input fields.
 */
function clearFailAdd(inputId, errorId) {
    let inputValue = document.getElementById(inputId).value.trim();
    if (inputValue !== '') {
        document.getElementById(errorId).classList.add('d_none');
        document.getElementById(inputId).classList.remove('failinput');
    }
    if (document.getElementById('name').value.trim() !== '' &&
        document.getElementById('email').value.trim() !== '' &&
        document.getElementById('phone').value.trim() !== '') {
        document.getElementById('failAll').classList.add('d_none');
    }
}

/**
 * If all input fields have valid values, the error message for missing input is also removed.
 */
function clearFailEdit(inputId, errorId) {
    let inputValue = document.getElementById(inputId).value.trim();
    if (inputValue !== '') {
        document.getElementById(errorId).classList.add('d_none');
        document.getElementById(inputId).classList.remove('failinput');
    }
    if (document.getElementById('name2').value.trim() !== '' &&
        document.getElementById('email2').value.trim() !== '' &&
        document.getElementById('phone2').value.trim() !== '') {
        document.getElementById('failAllEdit').classList.add('d_none');
    }
}

/**
 * Creates new contact data.
 */
async function createContactData(name, email, phone, number, firstNameInitial, color) {
    await postCreateData(`/contact/contact${number}`, {
        'name': name,
        'color': color,
        'email': email,
        'rufnummer': phone,
        'cat': firstNameInitial,
        'number': number
    });
}


/**
 * Sends a PATCH request to the specified path with the provided data.
 * Resets the array and reloads the data upon completion.
 */
async function postCreateData(path = "", data = {}) {
    try {
        let firebaseUrl = await fetch(getDatabaseUrl(path), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        array = [];
        load();
    } catch (error) {
    }
}

/**
 * Extracts the initials from a given contact name.
 */
function extrahiereInitialen(contactName) {
    let nameParts = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i].charAt(0).toUpperCase();
    }
    return initials;
}


/**
 * Extracts the first initial from a given contact name.
 */
function extrahiereInitialen2(contactName) {
    let nameParts = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < 1; i++) {
        initials += nameParts[i].charAt(0).toUpperCase();
    }
    return initials;
}

/**
 * Generates a random color.
 */

function coloGenerator() {
    let randomColor = colorGen[Math.floor(Math.random() * colorGen.length)];
    return randomColor;
}


/**
 * Generates a random 6-digit number ensuring no digit is zero.
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
 * Deletes a contact based on the contact number.
 */
async function deleteContact(number) {
    let contactDetails = document.getElementById('contactDetails');
    let path = `/contact/contact${number}`;
    let url = getDatabaseUrl(path);
    let response = await fetch(url, {
        method: 'DELETE',
    });
    saveEditDisplayOff();

    array = [];
    load();
}

/**
 * Deletes the contact at the given index and clears the edit view.
 */
function deleteEdit(i) {
    let number = array[i].number;
    deleteContact(number);
    saveEditDisplayOff();
}

/**
 * Updates the contact data.
 */
async function editContactData(i) {
    let number = array[i].number;
    let name = document.getElementById('name2').value;
    let email = document.getElementById('email2').value;
    let phone = document.getElementById('phone2').value;
    if (valiEdit()) {
        await editContactFB(name, email, phone, number)
        saveEditDisplayOff();
    }
}

/**
 * Hides the edit overlay and adjusts the display of contact details and container elements
 * based on the window width. Clears the content of the contact details section.
 */
function saveEditDisplayOff() {
    let contactDetail = document.getElementById('contactDetails');
    if (window.innerWidth <= 800) {
        document.querySelector('.container').classList.remove('hidden');
        document.querySelector('.container').classList.add('OnDetails');
        document.querySelector('.contact-container-right').classList.remove('OnDetails');
        document.querySelector('.contact-container-right').classList.add('hidden');
        document.getElementById('overlayEdit').classList.add('d_none');
        contactDetail.innerHTML = '';
    } else {
        document.getElementById('overlayEdit').classList.add('d_none');
        contactDetail.innerHTML = '';
    }
}

/**
 * Updates the contact data in the database.
 */
async function editContactFB(name, email, phone, number) {
    let path = `/contact/contact${number}`
    await postEditData(path, {
        'name': name,
        'email': email,
        'rufnummer': phone,
    });
}

/**
 * Sends a PATCH request to update data at the specified path.
 * Clears the array and reloads data upon completion.
 */
async function postEditData(path, data) {
    try {
        let firebaseUrl = await fetch(getDatabaseUrl(path), {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
        array = [];
        load();
    } catch (error) {
    }
}