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

function extrahiereInitialen(contactName) {
    for (let i = 0; i < contactName.length; i++) {
        let nameParts = contactName.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}