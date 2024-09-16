let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
let path = "";
let array = [];
let draggedElement;

async function load() {
    await loadData("/contacts");
}

async function loadData(path){
    let response = await fetch(BASE_URL + path + ".json");
    let responsetoJason = await response.json();
    if (responsetoJson) {
        let contactsArray = Object.values(responsetoJason);
        for (let i = 0; i < contactsArray.length; i++) {
            array.push(contactsArray[i]);
        }
        displayContacts();
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