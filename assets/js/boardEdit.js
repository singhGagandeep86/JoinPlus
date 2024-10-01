
let pathC = '';
let base_UrlC = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
function loadContact(i) {
    fetchContact("/contact", i)
}

async function fetchContact(pathC, i) {
    let firebaseUrl = await fetch(base_UrlC + pathC + ".json");
    let firebaseUrlAsJson = await firebaseUrl.json();
    let firebaseData = Object.values(firebaseUrlAsJson);
    loadContactData(firebaseData, i)
}
function loadContactData(firebaseData, i) {
    let contactArea = document.getElementById('contactDropArea');
    let contact = Object.values(arrayLoad[i]['contact']);
    let contactData = contactArray(firebaseData);
    
    contactArea.innerHTML = '';
    for (let j = 0; j < firebaseData.length; j++) {
        let contactName = contactData[j];
        let color = firebaseData[j].color;
        let initials = extrahiereInitialen(contactName);
        let isChecked = contact.some(selectedContact => selectedContact === contactName) ? 'checked' : '';
        contactArea.innerHTML += checkboxContactTemplate(isChecked, contactName, initials, color);
        

    }
}

function initialsLoad(i) {
    let contactUser = Object.values(arrayLoad[i]['contact']);
    let color = Object.values(arrayLoad[i].contactcolor);
    let initialsContact = document.getElementById('initialsArea');
    for (let k = 0; k < contactUser.length; k++) {
        let contactName = contactUser[k];
        let colorIni = color[k];
        let initials = extrahiereInitialen(contactName);
        initialsContact.innerHTML += initialsLoadContact(initials, colorIni);
    }
   
    
    
}

function contactArray(firebaseData) {
    let elementContact = [];
    for (let i = 0; i < firebaseData.length; i++) {
        elementContact.push(firebaseData[i].name);
    }
    return elementContact;
}

function editOpen(i,) {
    let edit = document.getElementById('popupTaskInfo');    
    let prioCheck = arrayLoad[i].prio;
    edit.innerHTML = '';
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    edit.innerHTML = editTask(i);
    loadContact(i);
    descriptionData(i);
    loadSubs(i);
    priorityEditCheck(prioCheck);    
    initialsLoad(i)
    let area = document.getElementById('edit');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function contactDropOpen() {
    let contactDropdown = document.getElementById('contactDropArea');
    let arrowContact = document.getElementById('arrowContactDrop');
    if (!contactDropdown.classList.contains('d_none')) {
        getSelectedContacts();
        intiCheckContact();
    }
    contactDropdown.classList.toggle('d_none');    
    arrowContact.classList.toggle('rotate');
}

function loadSubs(i) {
    let subtaskArea = document.getElementById('subTaskBoard');
    let subs = arrayLoad[i].subtask ? Object.values(arrayLoad[i].subtask) : null;
    if (subs == null) {
        subtaskArea.innerHTML = '';
    } else {
        for (let i = 0; i < subs.length; i++) {
            let subTaskData = subs[i];
            subtaskArea.innerHTML += addSubTask(subTaskData);
        }
    }
}

function descriptionData(i) {
    document.querySelector('.textAreaData').value = arrayLoad[i].description;
}

function priorityEditCheck(prioCheck) {
    let prio = document.getElementsByName('priority');
    for (let i = 0; i < prio.length; i++) {
        if (prio[i].value === prioCheck) {
            prio[i].checked = true;
            break;
        }
    }
}

function getSelectedContacts() {
    let checkContacts = [];
    let checkboxes = document.querySelectorAll('.checkboxDesignContact');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
           let contactName = checkboxes[i].closest('.contactDropCheck').querySelector('.contactNameEdit p').textContent;
            let colorName = checkboxes[i].closest('.contactDropCheck').querySelector('.boxinfoEdit');            
            if (colorName) {
                let color = colorName.classList[0].split('-')[1];
                checkContacts.push({ name: contactName, color: color });
            } 
        }
    }

    return checkContacts;
}

function intiCheckContact() {
    let initialsContact = document.getElementById('initialsArea');
    let checkContact = getSelectedContacts();    
    initialsContact.innerHTML = '';
    for (let i = 0; i < checkContact.length; i++) {
        let contactName = checkContact[i].name;
        let color = checkContact[i].color;
        let initials = extrahiereInitialen(contactName);
        initialsContact.innerHTML += initialsLoadContact(initials, color);
        
    }
    
    
}