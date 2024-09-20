let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
let path = '';
let array = [];


async function load() {
    await loadData("/contact");
    loadContact();
}

async function loadData(path){
    let response = await fetch(BASE_URL + path + ".json");
    let responsetoJson = await response.json();
    if (responsetoJson) {
        let contactsArray = Object.values(responsetoJson);
        for (let i = 0; i < contactsArray.length; i++) {
            array.push(contactsArray[i]);
        }
    }
}

async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function loadContact() {
    let contactSpace = document.getElementById('contactArea');
    contactSpace.innerHTML = '';

    for (let i = 0; i < array.length; i++) {
        let contactName = array[i].name;
        let initials = extrahiereInitialen(contactName)
        contactSpace.innerHTML += loadContactData(i, initials);
    }
}

function loadContactData(i, initials) {
    return `<div class="contact-group">
                <h2>${initials.charAt(0)}</h2>
                <div class="contact-item" onclick="showContactDetails(${i})">
                    <div class="avatar"><span class="b-${array[i].color}">${initials}</span></div>
                    <div class="details">
                        <div class="name">${array[i].name}</div>
                        <div class="email">${array[i].email}</div>
                    </div>
                </div>
            </div>`;
}

function showContactDetails(i) {
    let contactDetails = document.getElementById('contactDetails');
    contactDetails.innerHTML = `
        <div class="contact-ellipse">
            <button>AM</button>
            <div class="contact-mini">
                <h1>${array[i].name}</h1>
                <div class="editimage">
                    <img class="editimages" src="/assets/img/edit contacts.png">
                    <img class="editimages2" src="/assets/img/Delete contact.png">
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

    contactDetails.classList.add('contact-slide-in')
}

function extrahiereInitialen(contactName) {
    let nameParts = contactName.split(' ');
    let initials = '';
    for (let j = 0; j < nameParts.length; j++) {
        initials += nameParts[j].charAt(0).toUpperCase();
    }
    return initials;
}