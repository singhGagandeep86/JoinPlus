let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
let path = '';
let array = [];
let data = {};
let isEventListenerRegistered = false;

const farben = [
    "Purple", "Hellpurple", "Gelb", "Turkis", "Rosa", "Hellblau",
    "Rotorange", "Hellorange", "Dunkelgelb", "Blau", "Rot",
    "Rot2", "Neongelb", "Neongrün", "Neonorange"
];



async function load() {
    await loadData("/contact");
    sortContactsByName();
    loadContact();
}
function getDatabaseUrl(path) {
    const token = sessionStorage.getItem('authToken'); // Aktuellen Token abrufen
    return `${BASE_URL}${path}.json?auth=${token}`; // URL für die Datenbank zurückgeben
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

function loadContactData(i, initials) {
    return `<div class="contact-group">
                <div class="contact-item active2" onclick="showContactDetails(${i}, '${initials}')">
                    <div class="avatar"><span class="b-${array[i].color}">${initials}</span></div>
                    <div class="details">
                        <div class="name">${array[i].name}</div>
                        <div class="email changemycolor">${array[i].email}</div>
                    </div>
                </div>
            </div>`;
}

function showContactDetails(i, initials) {
    let contactDetails = document.getElementById('contactDetails');
    let allContacts = document.querySelectorAll('.contact-item');
    let number = array[i].number;

    if (allContacts[i].classList.contains('active-contact')) {

        allContacts[i].classList.remove('active-contact');
        contactDetails.innerHTML = '';
        return;
    }

    for (let i = 0; i < allContacts.length; i++) {
        allContacts[i].classList.remove('active-contact');
    }

    allContacts[i].classList.add('active-contact');
    contactDetails.classList.add('contact-slide-in')

    contactDetails.innerHTML = `
        <div class="contact-ellipse">
            <span class="contact-ellipse2 b-${array[i].color}">${initials}</span>
            <div class="contact-mini">
                <h1>${array[i].name}</h1>
                <div class="editimage">
                    <img class="editimages" src="../img/editcontacts.png">
                    <img onclick="deleteContact(${number})" class="editimages2" src="../img/Deletecontact.png">
                </div>
            </div>
        </div>
        <div class="contact-info">
            <span class="CI-info">Contact Information</span>
            <p><b>Email</b></p>
            <div class="changemycolor">${array[i].email}</div>
            <p><b>Phone</b></p>
            ${array[i].rufnummer || ''}
        </div>
    `;
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

            // Überprüfen, ob die Felder leer sind
            if (!name || !email || !phone) {
                console.error("Alle Felder müssen ausgefüllt sein!");
                return; // Wenn Felder leer sind, Abbruch
            }

            

            // Füge einen Debug-Log hinzu, um zu sehen, wann die Daten erstellt werden
            console.log("Daten werden erstellt für:", { name, email, phone, number, firstNameInitial, color });

            // Warte, bis der Kontakt hinzugefügt wurde, bevor das Formular geleert wird
            await createContactData(name, email, phone, number, firstNameInitial, color);

            // Eingabefelder leeren und Overlay ausblenden
            reloadAdd();
        });

        // Setze die Flag, um sicherzustellen, dass der Listener nur einmal registriert wird
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
    // Debug-Log für Daten, die in Firebase gespeichert werden sollen
    console.log("Speichern der Kontaktdaten in Firebase:", { name, email, phone, number, firstNameInitial, color });
    
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

        // Debug-Log, um zu überprüfen, ob die Anfrage erfolgreich war
        console.log("Anfrage erfolgreich gesendet an Firebase:", firebaseUrl);

        // Lade Kontakte neu oder mache weitere Aktionen
        array = [];
        load();
    } catch (error) {
        console.error("Fehler beim Senden der Daten:", error);
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