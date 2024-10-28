let path = '';
let array = [];
let data = {};
let isEventListenerRegistered = false;


let colorGen = [
    "Purple", "Hellpurple", "Gelb", "Turkis", "Rosa", "Hellblau",
    "Rotorange", "Hellorange", "Dunkelgelb", "Blau", "Rot",
    "Rot2", "Neongelb", "Neongrün", "Neonorange"
];

/**
 * Loads contact data, sorts it, displays the contact, and fetches user data.
 * This asynchronous function performs multiple tasks to load contact data,
 * sort it alphabetically, display it, and retrieve additional user data.
 */
async function load() {
    await loadData("/contact");
    sortContactsByName();
    loadContact();
    fetchUserData('/user');
}

/**
 * Generates the URL for the database path with an authentication token.
 * @returns {string} - The complete URL to the resource.
 */

function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Loads data from the specified URL and adds it to an array.
 * @returns {Promise<void>}
 */

async function loadData(path) {
    let response = await fetch(getDatabaseUrl(path));
    let responsetoJson = await response.json();
    if (responsetoJson) {
        let contactsArray = Object.values(responsetoJson);
        for (let i = 0; i < contactsArray.length; i++) {
            array.push(contactsArray[i]);
        }
    }
}

/**
 * Sends data via a POST request to the specified URL.
 * @returns {Promise<void>}
 */

async function postData(path, data) {
    let response = await fetch(getDatabaseUrl(path), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

/**
 * Sorts the contacts alphabetically by name.
 */

function sortContactsByName() {
    array.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
}

/**
 * Loads contacts into the display.
 */

function loadContact() {
    let contactSpace = document.getElementById('contactArea');
    contactSpace.innerHTML = '';
    let currentLetter = '';

    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let initials = extrahiereInitialen(contactName);
        let firstLetter = contactName.charAt(0).toUpperCase();

        if (firstLetter !== currentLetter) {
            contactSpace.innerHTML += `<h2>${firstLetter}</h2>`;
            currentLetter = firstLetter;
        }
        contactSpace.innerHTML += loadContactData(i, initials);
    }}

    /**
 * Displays the details of a selected contact.
 * @param {number} i - The index of the contact in the array.
 */

function showContactDetails(i, initials) {
    let number = array[i].number;
    let contactDetails = document.getElementById('contactDetails');
    let allContacts = document.querySelectorAll('.contact-item');
    if (allContacts[i].classList.contains('active-contact')) {
        allContacts[i].classList.remove('active-contact');
        contactDetails.innerHTML = '';
        return;
    }
    for (let i = 0; i < allContacts.length; i++) {
        allContacts[i].classList.remove('active-contact');
    }
    allContacts[i].classList.add('active-contact');
    contactDetails.classList.add('contact-slide-in');
    if (window.innerWidth <= 800) {
        document.querySelector('.container').classList.add('hidden');
        document.querySelector('.contact-container-right').classList.add('OnDetails');
    }
    activeContact(i, number, initials);
}

/**
 * Activates the contact and displays its details.
 * @param {number} i - The index of the contact.
 * @param {string} number - The phone number of the contact.
 * @param {string} initials - The initials of the contact.
 */

function activeContact(i, number, initials) {
    let contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = loadContactDetails(i, initials, number);
    initializeEditButton(i);
    contactDetails.onclick = function (event) {
        let editImage2 = document.getElementById('editImage2');
        if (!editImage2.contains(event.target)) {
            closeEditImage();
        }
    };
}

/**
 * Shows the contact list.
 * @param {number} i - The index of the contact.
 */

function showContactList(i) {
    let allContacts = document.querySelectorAll('.contact-item');
    document.querySelector('.container').classList.remove('hidden');
    document.querySelector('.contact-container-right').classList.remove('OnDetails');
    document.querySelector('.container').classList.add('OnDetails');
    document.querySelector('.contact-container-right').classList.add('hidden');
    allContacts[i].classList.remove('active-contact');
}

/**
 * Opens the edit window for a contact.
 * @param {number} i - The index of the contact.
 */

function editContact(i) {
    let contactName = array[i].name;
    let initials = extrahiereInitialen(contactName);
    let popUpEdit = document.getElementById('overlayEdit');
    document.getElementById('overlayEdit').classList.remove('d_none');
    popUpEdit.innerHTML = '';
    popUpEdit.innerHTML = overlay2(i, initials);
    loadInputEdit(i)
    document.querySelector('.contact-container-right').classList.add('hidden');
    stopEditArea();
}

/**
 * Stops the edit event.
 */

function stopEditArea() {
    let area = document.getElementById('EditAreaStop');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

/**
 * Loads the input fields for editing the contact.
 * @param {number} i - The index of the contact.
 */

function loadInputEdit(i) {
    document.getElementById("name2").value = array[i].name;
    document.getElementById("email2").value = array[i].email;
    document.getElementById("phone2").value = array[i].rufnummer;
}

/**
 * Initializes the edit button.
 * @param {number} i - The index of the contact.
 */

function initializeEditButton(i) {
    let editBtn = document.getElementById('editBtn');
    editBtn.onclick = function (event) {
        event.stopPropagation();
        toggleEditImage();
    };
    let editImage2 = document.getElementById('editImage2');
    editImage2.onclick = function (event) {
        event.stopPropagation();
    };
}

/**
 * Toggles the edit view.
 */

function toggleEditImage() {
    let editImage2 = document.getElementById('editImage2');
    if (editImage2.classList.contains('d_none')) {
        editImage2.classList.remove('d_none');
    } else {
        closeEditImage();
    }
}

/**
 * Closes the edit view.
 */

function closeEditImage() {
    let editImage2 = document.getElementById('editImage2');
    editImage2.classList.add('d_none');
}

/**
 * Closes the edit view for the contact.
 */

function editContactOff() {
    document.getElementById('overlayEdit').classList.add('d_none');
}

/**
 * Adds new contact data.
 * @returns {Promise<void>}
 */

async function addContactData() {
    let name = document.getElementById('name').value.trim();
    let email = document.getElementById('email').value.trim();
    let phone = document.getElementById('phone').value.trim();
    if (valiAdd(name, email, phone)) {
        let number = generateRandomNumber();
        let firstNameInitial = extrahiereInitialen2(name);
        let color = farbGenerator().toLowerCase();
        await createContactData(name, email, phone, number, firstNameInitial, color);
        reloadAdd();
    }
}

/**
 * Validates the input data for a new contact.
 */

function valiAdd(name, email, phone) {
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    let phoneRegex = /^[0-9]+$/;
    let nameRegex = /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/;
    if (!name || !email || !phone) {
        failAllAdd();
        return false;
    } if (!nameRegex.test(name)) {
        failName();
        return false;
    } if (!emailRegex.test(email)) {
        failEmailAdd();
        return false;
    } if (!phoneRegex.test(phone)) {
        failPhoneAdd();
        return false;
    }
    return true;
}

/**
 * Validates the input data for editing a contact.
 */

function valiEdit() {
    let name = document.getElementById('name2').value.trim();
    let email = document.getElementById('email2').value.trim();
    let phone = document.getElementById('phone2').value.trim();
    let emailRegex = /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/;
    let phoneRegex = /^[0-9]+$/;
    let nameRegex = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
    if (!name || !email || !phone) {
        failAllEdit();
        return false;
    } if (!nameRegex.test(name)) {
        failNameEdit();
        return false;
    } if (!emailRegex.test(email)) {
        failEmailEdit();
        return false;
    } if (!phoneRegex.test(phone)) {
        failPhoneEdit();
        return false;
    }
    return true;
}

/**
 * Marks the name field in case of incorrect input.
 */

function failName() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('failName').classList.remove('d_none');
}

/**
 * Marks the phone number field in case of incorrect input.
 */

function failPhoneAdd() {
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failPhone').classList.remove('d_none');
}

/**
 * Marks the email field in case of incorrect input.
 */

function failEmailAdd() {
    document.getElementById('email').classList.add('failinput');
    document.getElementById('failEmail').classList.remove('d_none');
}

/**
 * Marks all fields in case of missing input.
 */

function failAllAdd() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('email').classList.add('failinput');
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failAll').classList.remove('d_none');
}

/**
 * Marks all fields in case of missing input during editing.
 */

function failAllEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failAllEdit').classList.remove('d_none');
}

/**
 * Marks the phone number field in case of incorrect input during editing.
 */

function failPhoneEdit() {
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failPhoneEdit').classList.remove('d_none');
}

/**
 * Marks the email field in case of incorrect input during editing.
 */

function failEmailEdit() {
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('failEmailEdit').classList.remove('d_none');
}

/**
 * Marks the name field in case of incorrect input during editing.
 */

function failNameEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('failNameEdit').classList.remove('d_none');
}