let path = '';
let array = [];
let data = {};
let isEventListenerRegistered = false;
let mediaQueryContact = window.matchMedia("(max-width: 800px)");

let farben = [
    "Purple", "Hellpurple", "Gelb", "Turkis", "Rosa", "Hellblau",
    "Rotorange", "Hellorange", "Dunkelgelb", "Blau", "Rot",
    "Rot2", "Neongelb", "Neongrün", "Neonorange"
];

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
    }
}

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
    activeContact(i,number,initials);
}

function activeContact(i,number,initials) {
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
    let popUpEdit = document.getElementById('overlay2');
    document.getElementById('overlay2').classList.remove('d_none');
    popUpEdit.innerHTML = '';
    popUpEdit.innerHTML = overlay2(i);
    document.getElementById("name2").value = array[i].name;
    document.getElementById("email2").value = array[i].email;
    document.getElementById("phone2").value = array[i].rufnummer;
    document.querySelector('.contact-container-right').classList.add('hidden');
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
    document.getElementById('overlay2').classList.add('d_none');

}

function addContactData() {
    if (!isEventListenerRegistered) {
        document.getElementById('contactForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            console.log('Form submit triggered');

            let name = document.getElementById('name').value.trim();
            let email = document.getElementById('email').value.trim();
            let phone = document.getElementById('phone').value.trim();
            let number = generateRandomNumber();
            let firstNameInitial = extrahiereInitialen2(name);
            let color = farbGenerator().toLowerCase();

            if (!name || !email || !phone) {
                return;
            }
            await createContactData(name, email, phone, number, firstNameInitial, color);

            reloadAdd();
        });

        isEventListenerRegistered = true;
    }
}

function reloadAdd() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('overlay').classList.remove('show');
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
    let zufaelligeFarbe = farben[Math.floor(Math.random() * farben.length)];
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
    contactDetails.innerHTML = '';
    array = [];
    load();
}

function deleteEdit(i) {
    let contactDetail = document.getElementById('contactDetails');
    let number = array[i].number;
    deleteContact(number);
    document.getElementById('overlay2').classList.remove('show');
    contactDetail.innerHTML = '';
}

async function editContactData(event, i) {
    event.preventDefault();
    let number = array[i].number;
    let contactDetail = document.getElementById('contactDetails');
    let name = document.getElementById('name2').value;
    let email = document.getElementById('email2').value;
    let phone = document.getElementById('phone2').value;
    await editContactFB(name, email, phone, number)
    document.getElementById('overlay2').classList.remove('show');
    contactDetail.innerHTML = '';
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