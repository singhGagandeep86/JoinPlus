let pathC = '';

function loadContact(objData) {
    fetchContact("/contact", objData)
}

async function fetchContact(pathC, objData) {
    let firebaseUrl = await fetch(BASE_URL + pathC + ".json?auth=" + token);
    let firebaseUrlAsJson = await firebaseUrl.json();
    let firebaseData = Object.values(firebaseUrlAsJson);
    loadContactData(firebaseData, objData)
}

function loadContactData(firebaseData, objData) {
    let contactArea = document.getElementById('contactDropArea');
    let contact = objData.contact === undefined
        ? null
        : Object.values(objData.contact).every(name => name === null)
            ? null
            : Object.values(objData.contact);
    let contactData = contactArray(firebaseData);
    contactArea.innerHTML = '';
    if (contact == null) {
        loadContactEmpty(contactData, firebaseData)
    } else {
        for (let j = 0; j < firebaseData.length; j++) {
            let contactName = contactData[j];
            let color = firebaseData[j].color;
            let initials = extrahiereInitialen(contactName);
            let isChecked = contact.some(selectedContact => selectedContact === contactName) ? 'checked' : '';
            contactArea.innerHTML += checkboxContactTemplate(isChecked, contactName, initials, color);
        }
    }
}

function loadContactEmpty(contactData, firebaseData) {
    let contactArea = document.getElementById('contactDropArea');
    for (let j = 0; j < firebaseData.length; j++) {
        let contactName = contactData[j];
        let color = firebaseData[j].color;
        let initials = extrahiereInitialen(contactName);
        contactArea.innerHTML += checkboxContactTemplateEmpty(contactName, initials, color);
    }
}

function initialsLoad(objData) {
    let contactUser = objData.contact === undefined ? null : Object.values(objData.contact).every(name => name === null)
            ? null
            : Object.values(objData.contact);
    let color = objData.contactcolor === undefined ? null : Object.values(objData.contactcolor);
    let initialsContact = document.getElementById('initialsArea');
    if (contactUser == null) {
        initialsContact.innerHTML = '';
        initialsContact.classList.add('d_none');
    } else {
        for (let k = 0; k < contactUser.length; k++) {
            let contactName = contactUser[k];
            let colorIni = color[k];
            let initials = extrahiereInitialen(contactName);
            initialsContact.innerHTML += initialsLoadContact(initials, colorIni);
        }
    }
}

function contactArray(firebaseData) {
    let elementContact = [];
    for (let i = 0; i < firebaseData.length; i++) {
        elementContact.push(firebaseData[i].name);
    }
    return elementContact;
}

function editOpen(i) {
    let edit = document.getElementById('popupTaskInfo');
    let objData = createobjFromElement(i)
    let prioCheck = objData.prio;
    edit.innerHTML = '';
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    edit.innerHTML = editTask(objData);
    loadEditData(objData, prioCheck)
    let area = document.getElementById('EditCloseArea');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function dateVali() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('dateEditEnter').setAttribute('min', today);
}

function loadEditData(objData, prioCheck) {
    loadContact(objData);
    descriptionData(objData);
    substartDiv();
    loadSubs(objData);
    priorityEditCheck(prioCheck);
    initialsLoad(objData)
    dateVali();
}

function contactDropOpen(event) {
    event.stopPropagation();
    let contactDropdown = document.getElementById('contactDropArea');
    let arrowContact = document.getElementById('arrowContactDrop');
    if (!contactDropdown.classList.contains('d_none')) {
        getSelectedContacts();
        intiCheckContact();
    }
    contactDropdown.classList.toggle('d_none');
    arrowContact.classList.toggle('rotate');
    if (!contactDropdown.classList.contains('d_none')) {
        document.addEventListener('click', closeDropDownContact);
    } else {
        document.removeEventListener('click', closeDropDownContact);
    }
}

function closeDropDownContact(event) {
    let contactDropdown = document.getElementById('contactDropArea');
    let arrowContact = document.getElementById('arrowContactDrop');
    if (!contactDropdown.contains(event)) {
        getSelectedContacts();
        intiCheckContact();
        contactDropdown.classList.add('d_none');
        arrowContact.classList.remove('rotate');
        document.removeEventListener('click', closeDropDownContact);
    }
}
function loadSubs(objData) {
    let subtaskArea = document.getElementById('subTaskBoard');
    let subs = objData.subtask ? Object.values(objData.subtask) : null;
    if (subs == null) {
        subtaskArea.innerHTML = '';
    } else {
        for (let i = 0; i < subs.length; i++) {
            let subTaskData = subs[i];
            subtaskArea.innerHTML += addSubTask(subTaskData);
        }
    }
}

function descriptionData(objData) {
    document.querySelector('.textAreaData').value = objData.description;
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
    if(checkContact != []){       
            initialsContact.classList.remove('d_none');
        for (let i = 0; i < checkContact.length; i++) {
            let contactName = checkContact[i].name;
            let color = checkContact[i].color;
            let initials = extrahiereInitialen(contactName);
            initialsContact.innerHTML += initialsLoadContact(initials, color);
        }
    }   
}

async function deleteData(element) {
    let path = `/task/task${element}`;
    let url = getDatabaseUrl(path);
    let response = await fetch(url, {
        method: 'DELETE',
    });
    closePopUpTaskSmall();
    arrayLoad = [];
    loadData("/task");
}

async function createEmptyTaskNode(path) {
    let task = "";
    await fetch(getDatabaseUrl(path), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    });
}

function substartDiv() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskstart();
}

function subtastAdd() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskAdd();
}

function deletInput() {
    substartDiv();
}

function addInputSubtastk() {
    let input = document.getElementById('subInput');
    let inputValue = input.value.trim();
    if (inputValue !== '') {
        loadSubtaskLi(inputValue);
        substartDiv();
    }
}

function loadSubtaskLi(inputValue) {
    let subtaskArea = document.getElementById('subTaskBoard');
    subtaskArea.innerHTML += addSubTask(inputValue);
}

function editSubTask(liElement) {
    let currentText = liElement.querySelector('.taskText').textContent.trim().substring(2);
    liElement.innerHTML = templateSub1(currentText);
}

function deleteTask(event) {
    event.stopPropagation();
    let liElement = event.target.closest('li');
    liElement.remove();
}

function saveTask(event, checkElement) {
    event.stopPropagation();
    let liElement = checkElement.closest('li');
    let inputField = liElement.querySelector('input.inputSubAdd');
    if (inputField) {
        let newValue = inputField.value.trim();
        if (newValue !== '') {
            liElement.innerHTML = templateSub2(newValue);
        }
    }
}

function toggleEditTask(event, checkElement) {
    event.stopPropagation();
    let liElement = checkElement.closest('li');
    let inputField = liElement.querySelector('input.inputSubAdd');
    if (liElement.classList.contains('editing')) {
        let newValue = inputField.value.trim();
        if (newValue !== '') {
            liElement.innerHTML = templateSub3(newValue);
            liElement.classList.remove('editing');
        }
    } else {
        let currentText = liElement.querySelector('.taskText').textContent.trim().substring(2);
        liElement.innerHTML = templateSub4(currentText);
        liElement.classList.add('editing');
    }
}


function getAllSubTasks() {
    let subTaskElements = document.querySelectorAll('#subTaskBoard .liSubTask');
    let subTaskValues = [];
    for (let i = 0; i < subTaskElements.length; i++) {
        let taskText = subTaskElements[i].querySelector('.taskText').innerText.trim().substring(2);
        subTaskValues.push(taskText);
    }
    return subTaskValues;
}

function readPrio() {
    let priorityElements = document.querySelectorAll('input[name="priority"]');
    let priority;
    for (let i = 0; i < priorityElements.length; i++) {
        if (priorityElements[i].checked) {
            priority = priorityElements[i].value;
            break;
        }
    }
    return priority;
}

function readEditData(number) {
    let numberEditElement = number;
    let title = document.querySelector('.titleInput').value.trim();
    let description = document.querySelector('.textAreaData').value;
    let dueDate = document.querySelector('.DueDate').value;
    let priority = readPrio();
    let contact = getSelectedContacts();
    let subtask = getAllSubTasks();
    let subtaskobj = subtaskObj(subtask)
    let checked = checkedObj(subtask);
    let contactName = nameObj(contact);
    let color = colorObj(contact);
    nameValiEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority);
}

function nameValiEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority) {
    if (title === '') {
        failNameEditBoard();
        return false;
    } else {
        pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority);
    }
}
function clearFailAdd() {
    let title = document.querySelector('.titleInput').value.trim();
    if (title !== '') {
        document.getElementById('failTitleEditBoard').classList.add('d_none');
        document.getElementById('titleEditFail').classList.remove('titleInputFail');
    }
}

function failNameEditBoard() {
    document.getElementById('titleEditFail').classList.add('titleInputFail');
    document.getElementById('failTitleEditBoard').classList.remove('d_none');

}

function subtaskObj(subtask) {
    let subtaskobj = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        subtaskobj[`task${i + 1}`] = subtaskText;
    }
    return subtaskobj
}

function checkedObj(subtask) {
    let checked = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        checked[`task${i + 1}`] = false;
    }
    return checked
}

function nameObj(contact) {
    let contactName = {};
    for (let i = 0; i < contact.length; i++) {
        let contactData = contact[i].name;
        contactName[`contact${i + 1}`] = contactData;
    }
    return contactName
}

function colorObj(contact) {
    let color = {};
    for (let i = 0; i < contact.length; i++) {
        let contactColor = contact[i].color;
        color[`color${i + 1}`] = contactColor;
    }
    return color
}

function pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority) {
    postEditData(`/task/task${numberEditElement}`, {
        'contact': contactName,
        'contactcolor': color,
        'date': dueDate,
        'description': description,
        'prio': priority,
        'title': title,
        'subtask': subtaskobj,
        'checked': checked
    });
}

async function postEditData(path = "", data = {}) {
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "PATCH",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadnewTaskEdit();
}

function loadnewTaskEdit() {
    arrayLoad = [];
    load();
    closePopUpTaskSmall();
}