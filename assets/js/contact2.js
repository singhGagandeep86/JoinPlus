/**
 * Resets the input fields for a new contact.
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
 * Clears the error markings in the edit input fields.
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
 * @returns {Promise<void>}
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
 * Sends data for creating a contact via POST.
 * @returns {Promise<void>}
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
 * Extracts the initials of a contact name.
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
 * Extracts the first letter of the contact name.
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
 * @returns {string} - A random color.
 */

function farbGenerator() {
    let zufaelligeFarbe = colorGen[Math.floor(Math.random() * colorGen.length)];
    return zufaelligeFarbe;
}

/**
 * Generates a random six-digit number.
 * @returns {string} - A random six-digit number.
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
 * @returns {Promise<void>}
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
 * Deletes the edited contact.
 */

function deleteEdit(i) {
    let number = array[i].number;
    deleteContact(number);
    saveEditDisplayOff();
}

/**
 * Updates the contact data.
 * @returns {Promise<void>}
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
 * Hides the edit display.
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
 * @param {string} name - The name of the contact.
 * @returns {Promise<void>}
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
 * Sends updated contact data via POST.
 * @returns {Promise<void>}
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