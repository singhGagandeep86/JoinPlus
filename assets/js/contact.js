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
 * Loads contact data and user information asynchronously.
 * This function performs the following tasks:
 * @returns {Promise<void>}
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
 * Sorts the array of contacts by their names in ascending order.
 * @returns {undefined}
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
 * Loads contact data into the contact area.
 * Iterates through the contact array and populates the contact area with HTML for each contact.
 * @returns {undefined}
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
 * Clears the currently active contact by removing the 'active-contact' class from all contact items
 * and clearing the contact details area.
 * @returns {undefined}
 */
    function clearActiveContact() {
        let allContacts = document.querySelectorAll('.contact-item');
        for (let j = 0; j < allContacts.length; j++) {
            allContacts[j].classList.remove('active-contact');
        }
        document.getElementById('contactDetails').innerHTML = '';
    }


/**
 * Sets a contact as active, loading its details and adding a class of 'active-contact' to the associated contact item.
 * @param {number} i - The index of the contact to set as active.
 * @param {string} number - The phone number of the active contact.
 * @param {string} initials - The initials of the active contact.
 */
    function setActiveContact(i, number, initials) {
        let allContacts = document.querySelectorAll('.contact-item');
        let contactDetails = document.getElementById('contactDetails');

        allContacts[i].classList.add('active-contact');
        contactDetails.classList.add('contact-slide-in');

        if (window.innerWidth <= 800) {
            document.querySelector('.container').classList.add('hidden');
            document.querySelector('.contact-container-right').classList.add('OnDetails');
        }
        activeContact(i, number, initials);
    }

/**
 * Toggles the active state of a contact and displays its details when clicked.
 * @param {number} i - The index of the contact to toggle.
 * @param {string} initials - The initials of the contact to toggle.
 */
    function showContactDetails(i, initials) {
        let number = array[i].number;
        let allContacts = document.querySelectorAll('.contact-item');

        if (allContacts[i].classList.contains('active-contact')) {
            clearActiveContact();
        } else {
            clearActiveContact();
            setActiveContact(i, number, initials);
        }
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
 * Displays the contact list by toggling visibility of related UI components.
 * @param {number} i - The index of the contact to be deactivated.
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
 * Prevents the event from bubbling up from the EditAreaStop element, thus preventing the click event from
 * triggering the closing of the edit window when the area is clicked.
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
 * Toggles the visibility of the edit image element. If the element is currently hidden,
 * it will be shown; otherwise, it will call the function to close the edit view.
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
 * Hides the edit image element again.
 */
function closeEditImage() {
    let editImage2 = document.getElementById('editImage2');
    editImage2.classList.add('d_none');
}


/**
 * Hides the edit contact overlay.
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
        let color = coloGenerator().toLowerCase();
        await createContactData(name, email, phone, number, firstNameInitial, color);
        reloadAdd();
    }}

/**
 * @param {string} input - The input string to be validated.*/

function isValid(input, regex) { return regex.test(input); }

/**
 * Validates name, email, and phone inputs for a form submission.
 * @returns {boolean} - Returns true if all fields are valid; otherwise, false.
 */
function valiAdd(name, email, phone) {
    if (!name || !email || !phone) return failAllAdd() && false;
    if (!isValid(name, /^[a-zA-ZäöüÄÖÜ]+( [a-zA-ZäöüÄÖÜ]+)*$/)) return failName() && false;
    if (!isValid(email, /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/))
        return failEmailAdd() && false;
    if (!isValid(phone, /^[0-9]+$/)) return failPhoneAdd() && false;
    return true;
}

/**
 * @returns {boolean} - Returns true if the input matches the regex; otherwise, false.
 */
function isValid(input, regex) { return regex.test(input); }

/**
 * Validates the 'name', 'email', and 'phone' inputs for editing form data.
 * @returns {boolean} - Returns true if all fields are valid; otherwise, false.
 */
function valiEdit() {
    let name = document.getElementById('name2').value.trim(),
        email = document.getElementById('email2').value.trim(),
        phone = document.getElementById('phone2').value.trim();

    if (!name || !email || !phone) return failAllEdit() && false;
    if (!isValid(name, /^[a-zA-Z]+( [a-zA-Z]+)*$/)) return failNameEdit() && false;
    if (!isValid(email, /^[^\s@]+@[^\s@]+\.(com|org|net|edu|gov|mil|info|biz|de|uk|fr|ca|au|us|cn|jp|in|ru|app|shop|tech|online|blog)$/)) 
        return failEmailEdit() && false;
    if (!isValid(phone, /^[0-9]+$/)) return failPhoneEdit() && false;
    return true;
}

/**
 * Marks the name field as invalid by adding a 'failinput' class and
 * displays an error message by removing the 'd_none' class.
 */
function failName() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('failName').classList.remove('d_none');
}

/**
 * Marks the phone field as invalid by adding a 'failinput' class and
 * displays an error message by removing the 'd_none' class.
 */
function failPhoneAdd() {
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failPhone').classList.remove('d_none');
}

/**
 * Marks the email field as invalid by adding a 'failinput' class and
 * displays an error message by removing the 'd_none' class.
 */
function failEmailAdd() {
    document.getElementById('email').classList.add('failinput');
    document.getElementById('failEmail').classList.remove('d_none');
}

/**
 * Marks all fields in the add contact form as invalid by adding a 'failinput' class to each element
 * and displays an error message by removing the 'd_none' class from the 'failAll' element.
 */
function failAllAdd() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('email').classList.add('failinput');
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failAll').classList.remove('d_none');
}

/**
 * Marks all fields in the edit contact form as invalid by adding a 'failinput' class to each element
 * and displays an error message by removing the 'd_none' class from the 'failAllEdit' element.
 */
function failAllEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failAllEdit').classList.remove('d_none');
}

/**
 * Adds a red border to the phone input field and makes the error message visible in the edit contact form.
 */
function failPhoneEdit() {
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failPhoneEdit').classList.remove('d_none');
}

/**
 * Adds a red border to the email input field and makes the error message visible in the edit contact form.
 */
function failEmailEdit() {
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('failEmailEdit').classList.remove('d_none');
}