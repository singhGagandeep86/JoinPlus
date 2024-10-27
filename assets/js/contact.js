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
 * Lädt die erforderlichen Daten und initialisiert die Kontaktansicht.
 *
 * Diese asynchrone Funktion führt mehrere Aufgaben aus, um die Kontaktdaten zu laden,
 * die Daten zu sortieren und anzuzeigen sowie zusätzliche Benutzerdaten abzurufen.
 */
async function load() {
    await loadData("/contact");
    sortContactsByName();
    loadContact();
    fetchUserData('/user');
}

function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

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

async function postData(path, data) {
    let response = await fetch(getDatabaseUrl(path), {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

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

function showContactList(i) {
    let allContacts = document.querySelectorAll('.contact-item');
    document.querySelector('.container').classList.remove('hidden');
    document.querySelector('.contact-container-right').classList.remove('OnDetails');
    document.querySelector('.container').classList.add('OnDetails');
    document.querySelector('.contact-container-right').classList.add('hidden');
    allContacts[i].classList.remove('active-contact');
}

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

function stopEditArea() {
    let area = document.getElementById('EditAreaStop');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function loadInputEdit(i) {
    document.getElementById("name2").value = array[i].name;
    document.getElementById("email2").value = array[i].email;
    document.getElementById("phone2").value = array[i].rufnummer;
}

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

function toggleEditImage() {
    let editImage2 = document.getElementById('editImage2');
    if (editImage2.classList.contains('d_none')) {
        editImage2.classList.remove('d_none');
    } else {
        closeEditImage();
    }
}

function closeEditImage() {
    let editImage2 = document.getElementById('editImage2');
    editImage2.classList.add('d_none');
}

function editContactOff() {
    document.getElementById('overlayEdit').classList.add('d_none');
}

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

function failName() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('failName').classList.remove('d_none');
}

function failPhoneAdd() {
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failPhone').classList.remove('d_none');
}

function failEmailAdd() {
    document.getElementById('email').classList.add('failinput');
    document.getElementById('failEmail').classList.remove('d_none');
}

function failAllAdd() {
    document.getElementById('name').classList.add('failinput');
    document.getElementById('email').classList.add('failinput');
    document.getElementById('phone').classList.add('failinput');
    document.getElementById('failAll').classList.remove('d_none');
}

function failAllEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failAllEdit').classList.remove('d_none');
}

function failPhoneEdit() {
    document.getElementById('phone2').classList.add('failinput');
    document.getElementById('failPhoneEdit').classList.remove('d_none');
}

function failEmailEdit() {
    document.getElementById('email2').classList.add('failinput');
    document.getElementById('failEmailEdit').classList.remove('d_none');
}

function failNameEdit() {
    document.getElementById('name2').classList.add('failinput');
    document.getElementById('failNameEdit').classList.remove('d_none');
}

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

function extrahiereInitialen(contactName) {
    let nameParts = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < nameParts.length; i++) {
        initials += nameParts[i].charAt(0).toUpperCase();
    }
    return initials;
}

function extrahiereInitialen2(contactName) {
    let nameParts = contactName.split(' ');
    let initials = '';
    for (let i = 0; i < 1; i++) {
        initials += nameParts[i].charAt(0).toUpperCase();
    }
    return initials;
}

function farbGenerator() {
    let zufaelligeFarbe = colorGen[Math.floor(Math.random() * colorGen.length)];
    return zufaelligeFarbe;
}

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

function deleteEdit(i) {
    let number = array[i].number;
    deleteContact(number);
    saveEditDisplayOff();
}

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

async function editContactFB(name, email, phone, number) {
    let path = `/contact/contact${number}`
    await postEditData(path, {
        'name': name,
        'email': email,
        'rufnummer': phone,
    });
}

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