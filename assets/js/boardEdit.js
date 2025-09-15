

/** Loads and displays contact data in the contact drop area.*/
function loadContactData(firebaseData, objData) {
    let contactArea = document.getElementById('contactDropArea');
    let contact = objData.contact === undefined ? null : Object.values(objData.contact).every(name => name === null)
        ? null
        : Object.values(objData.contact);
    let contactData = contactArray(firebaseData);
    contactArea.innerHTML = '';
    loadContactDataIf(contact, contactData, firebaseData, contactArea);
}

/**
 * When contacts are provided, each contact's details, including name, initials, color,
 * and checkbox status, are dynamically generated and displayed within the contact area. */
function loadContactDataIf(contact, contactData, firebaseData, contactArea) {

    if (contact == null) {
        loadContactEmpty(contactData, firebaseData)
    } else {
        for (let j = 0; j < firebaseData.length; j++) {
            let contactName = contactData[j];
            let color = firebaseData[j].color;
            let initials = extrahiereInitialen(contactName);
            let pic = firebaseData[j].pic;
            let isChecked = contact.some(selectedContact => selectedContact.name === contactName) ? 'checked' : '';
            if (pic) {
                contactArea.innerHTML += checkboxContactTemplateWithPic(isChecked, contactName, pic, color);
            } else {
                contactArea.innerHTML += checkboxContactTemplate(isChecked, contactName, initials, color);
            }
        }
    }
}

/** Loads and displays an empty state for contact data in the contact drop area.*/
function loadContactEmpty(contactData, firebaseData) {
    let contactArea = document.getElementById('contactDropArea');
    for (let j = 0; j < firebaseData.length; j++) {
        let contactName = contactData[j];
        let color = firebaseData[j].color;
        let initials = extrahiereInitialen(contactName);
        contactArea.innerHTML += checkboxContactTemplateEmpty(contactName, initials, color);
    }
}

/** Loads and displays the initials of the contacts associated with a given task.*/
function initialsLoad(objData) {

    let contactUser = objData.contact === undefined ? null : Object.values(objData.contact).every(name => name === null)
        ? null
        : Object.values(objData.contact);
    let color = objData.contactcolor === undefined ? null : Object.values(objData.contactcolor);
    let initialsContact = document.getElementById('initialsArea');
    initialsLoadIf(contactUser, color, initialsContact)
}

/**
 * Loads and displays initials for each user in the provided contact list.*/
function initialsLoadIf(contactUser, color, initialsContact) {
    if (contactUser == null) {
        initialsContact.innerHTML = '';
        initialsContact.classList.add('d_none');
    } else {

        for (let k = 0; k < contactUser.length; k++) {
            let contactName = contactUser[k].name;
            let colorIni = color[k];
            let filteredContact = allContactsArray.find(e => e.number == contactUser[k].number);
            if (filteredContact && filteredContact.pic) {
                initialsContact.innerHTML += initialsLoadContactWithPic(filteredContact.pic, colorIni);
            } else {
                let initials = extrahiereInitialen(contactName);
                initialsContact.innerHTML += initialsLoadContact(initials, colorIni);
            }
        }
    }
}

/** Extracts and returns an array of contact names from the given Firebase data.*/
function contactArray(firebaseData) {
    let elementContact = [];
    for (let i = 0; i < firebaseData.length; i++) {
        elementContact.push(firebaseData[i].name);
    }
    return elementContact;
}

/** Opens the edit popup for a specific task and populates it with the task's details.*/
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

/** Sets the minimum allowable date for the date input field to today's date.*/
function dateVali() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('dateEditEnter').setAttribute('min', today);
}

/** Loads the necessary data for editing a task and initializes the UI components.*/
function loadEditData(objData, prioCheck) {
    loadContact(objData);
    descriptionData(objData);
    substartDiv();
    loadSubs(objData);
    priorityEditCheck(prioCheck);
    categorieSelect(objData);
    loadAllAttachments();
    initialsLoad(objData);
    dateVali();
}

/** Toggles the visibility of the contact dropdown menu and handles contact selection.*/
function contactDropOpen(event) {
    event.stopPropagation();
    let contactDropdown = document.getElementById('contactDropArea');
    let arrowContact = document.getElementById('arrowContactDrop');
    contactDropOpenIf(contactDropdown, arrowContact);
}

/**
 * Toggles the visibility of a contact dropdown menu and manages dropdown-related behaviors.
 * If the dropdown is opened, an event listener is added to close it when clicking outside;*/
function contactDropOpenIf(contactDropdown, arrowContact) {

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

/** Closes the contact dropdown menu when clicking outside of it.*/
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

/** Loads and displays subtasks in the specified subtask area.*/
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

/** Sets the value of the description textarea to the provided task description.*/
function descriptionData(objData) {
    document.querySelector('.textAreaData').value = objData.description;
}

/** Sets the checked state of the priority radio buttons based on the provided priority value.*/
function priorityEditCheck(prioCheck) {
    let prio = document.getElementsByName('priority');
    for (let i = 0; i < prio.length; i++) {
        if (prio[i].value === prioCheck) {
            prio[i].checked = true;
            break;
        }
    }
}

function categorieSelect(objData) {
    let category = objData.category;
    let categoryOption = document.getElementById('hiddenSelect');
    let customSelect = document.getElementById('customSelect');
    categoryOption.value = category;
    customSelect.innerText = category;
}

function loadAllAttachments() {
    let fileList = document.getElementById('fileList');
    let removeAll = document.getElementById('removeAll');
    fileList.innerHTML = '';
    if (attachmentsToArray.length === 0) {
        removeAll.classList.add('selectHide');
    } else {
        removeAll.classList.remove('selectHide');
        for (let index = 0; index < attachmentsToArray.length; index++) {
            const attachment = attachmentsToArray[index];
            fileList.innerHTML += filesTemplate(attachment.data, attachment.name);
        }
    }
}

function removeAllAttachments() {
    attachmentsToArray = [];
    fileList.innerHTML = '';
    removeAll.classList.add("selectHide");
}

/** Retrieves the selected contacts from the contact dropdown.*/
function getSelectedContacts() {
    let checkContacts = [];
    let checkboxes = document.querySelectorAll('.checkboxDesignContact');
    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            let contactName = checkboxes[i].closest('.contactDropCheck').querySelector('.contactNameEdit p').textContent;
            let colorName = checkboxes[i].closest('.contactDropCheck').querySelector('.boxinfoEdit');
            let number = allContactsArray[i].number;
            if (colorName) {
                let color = colorName.classList[0].split('-')[1];
                checkContacts.push({ name: contactName, color: color, number: number });
            }
        }
    }
    return checkContacts;
}

/** Initializes and displays the selected contacts' initials in the initials area.*/
function intiCheckContact() {

    let initialsContact = document.getElementById('initialsArea');
    let checkContact = getSelectedContacts();
    initialsContact.innerHTML = '';
    if (checkContact != []) {
        initialsContact.classList.remove('d_none');
        for (let i = 0; i < checkContact.length; i++) {
            let contactName = checkContact[i].name;
            let color = checkContact[i].color;
            let initials = extrahiereInitialen(contactName);
            let number = checkContact[i].number;
            let filteredContact = allContactsArray.find(e => e.number == number);
            if (filteredContact && filteredContact.pic) {
                initialsContact.innerHTML += initialsLoadContactWithPic(filteredContact.pic, color);
            } else {
                initialsContact.innerHTML += initialsLoadContact(initials, color);
            }
        }
    }
}

/** Initializes the subtask input area by clearing its current content*/
function substartDiv() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskstart();
}

/** Clears the current content of the subtask input area and populates it with a new subtask template.*/
function subtastAdd() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskAdd();
}

/** Resets the subtask input area by invoking the substartDiv function.*/
function deletInput() {
    substartDiv();
}

/** Adds a new subtask based on the value entered in the subtask input field.*/
function addInputSubtastk() {
    let input = document.getElementById('subInput');
    let inputValue = input.value.trim();
    if (inputValue !== '') {
        loadSubtaskLi(inputValue);
        substartDiv();
    }
}

function filesTemplate(img, name) {
    return `<div class="file-container">
    <img src=${img}>
    <div class="file-name">${name}</div>
    </div>`
}

/** Loads a new subtask into the subtask area of the task board.*/
function loadSubtaskLi(inputValue) {
    let subtaskArea = document.getElementById('subTaskBoard');
    subtaskArea.innerHTML += addSubTask(inputValue);
}

/** Edits a subtask by replacing its current content with an editable template.*/
function editSubTask(liElement) {
    let currentText = liElement.querySelector('.taskText').textContent.trim().substring(2);
    liElement.innerHTML = templateSub1(currentText);
}

/** Deletes a task from the list when the delete event is triggered.*/
function deleteTask(event) {
    event.stopPropagation();
    let liElement = event.target.closest('li');
    liElement.remove();
}

/** Saves the updated value of a subtask when triggered by an event.*/
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

/** Toggles the edit mode for a subtask when triggered by an event.*/
function toggleEditTask(event, checkElement) {
    event.stopPropagation();
    let liElement = checkElement.closest('li');
    let inputField = liElement.querySelector('input.inputSubAdd');
    toggleEditTaskIf(liElement, inputField);
}

/* When the item is in editing mode, it saves the updated task text if the input is not empty, */
function toggleEditTaskIf(liElement, inputField) {
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

/** Retrieves all subtask values from the subtask list.*/
function getAllSubTasks() {
    let subTaskElements = document.querySelectorAll('#subTaskBoard .liSubTask');
    let subTaskValues = [];
    for (let i = 0; i < subTaskElements.length; i++) {
        let taskText = subTaskElements[i].querySelector('.taskText').innerText.trim().substring(2);
        subTaskValues.push(taskText);
    }
    return subTaskValues;
}

/** Reads the selected priority value from a group of radio buttons.*/
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

/** Reads and collects data from the edit task form.*/
function readEditData(number) {
    let numberEditElement = number;
    let title = document.querySelector('.titleInput').value.trim();
    let description = document.querySelector('.textAreaData').value;
    let dueDate = document.querySelector('.DueDate').value;
    let priority = readPrio();
    let category = document.getElementById('customSelect').innerText;
    let color = generateCatColor(category);
    let contact = getSelectedContacts();
    let subtask = getAllSubTasks();
    let subtaskobj = subtaskObj(subtask)
    let checked = checkedObj(subtask);
    let contactName = nameObj(contact);
    let contactColor = colorObj(contact);
    let contacts = numberObj(contact);
    let attachments = attachmentsToArray;
    nameValiEdit(title, description, dueDate, subtaskobj, checked, contactName, color, contacts, numberEditElement, priority, category, contactColor, attachments);
    attachmentsToArray = [];
}

/** Validates the title of the task during the edit process.*/
function nameValiEdit(title, description, dueDate, subtaskobj, checked, contactName, color, contacts, numberEditElement, priority, category, contactColor, attachments) {
    if (title === '') {
        failNameEditBoard();
        return false;
    } else {
        pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, contacts, numberEditElement, priority, category, contactColor, attachments);
    }
}

/** Clears the failure message for the task title input during the edit process.*/
function clearFailAdd() {
    let title = document.querySelector('.titleInput').value.trim();
    if (title !== '') {
        document.getElementById('failTitleEditBoard').classList.add('d_none');
        document.getElementById('titleEditFail').classList.remove('titleInputFail');
    }
}

/** Adds an error message for the title editing.*/
function failNameEditBoard() {
    document.getElementById('titleEditFail').classList.add('titleInputFail');
    document.getElementById('failTitleEditBoard').classList.remove('d_none');
}

/** Converts an array of subtasks into an object with numbered keys.*/
function subtaskObj(subtask) {
    let subtaskobj = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        subtaskobj[`task${i + 1}`] = subtaskText;
    }
    return subtaskobj
}

function generateCatColor(category) {
    if (category === 'Technical Task') {
        return 'Tech';
    } else {
        return 'User';
    }

}

/** Creates an object representing the checked status of subtasks.*/
function checkedObj(subtask) {
    let checked = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        checked[`task${i + 1}`] = false;
    }
    return checked
}

/** Creates an object mapping contact names to numbered keys.*/
function nameObj(contact) {
    let contactName = {};
    for (let i = 0; i < contact.length; i++) {
        let contactData = contact[i].name;
        contactName[`contact${i + 1}`] = contactData;
    }
    return contactName
}

/** Creates an object mapping contact colors to numbered keys.*/
function colorObj(contact) {
    let color = {};
    for (let i = 0; i < contact.length; i++) {
        let contactColor = contact[i].color;
        color[`color${i + 1}`] = contactColor;
    }
    return color
}

function numberObj(contact) {
    let contacts = {};
    for (let i = 0; i < contact.length; i++) {
        let contactName = contact[i].name;
        let contactNumber = contact[i].number;
        contacts[`contact${i + 1}`] = { 'name': contactName, 'number': contactNumber };
    }
    return contacts
}

/** Loads new task data and refreshes the display.*/
function loadnewTaskEdit() {
    arrayLoad = [];
    load();
    closePopUpTaskSmall();
}

function openFilePicker() {
    let filesPicker = document.getElementById('filesPicker');

    if (!filesPicker) return;

    filesPicker.click();

    filesPicker.addEventListener('change', () => {
        const allFiles = filesPicker.files;

        if (allFiles.length > 0) {
            Array.from(allFiles).forEach(async file => {
                const blog = new Blob([file], { type: file.type });

                const base64 = await blobToBase64(blog);

                const img = document.createElement('img');
                img.src = base64;
                attachmentsToArray.push({
                    name: file.name,
                    type: file.type,
                    data: base64
                });
                loadAllAttachments();
            })
        }
    })
}

function showFile(img, name, index) {
    document.getElementById('photoArea').classList.remove('d_none');
    document.getElementById('photoArea').innerHTML = `
      <div class="imgContainer" onclick="event.stopPropagation()">
        <div class="imgHeader"><p id="selectionName"></p>
        <div class="imgHandle"><img src="../img/download.png" onClick="downloadFile(${index})"><img src="../img/CloseWhite.png" onClick="photoArea()"></div></div>
        <div class="imgMover"><img src="../img/arrow-Lft-line.png" onclick='slideImage("left", ${index})'><img src="../img/arrow-right-line.png" onclick='slideImage("right", ${index})'></div>
        <img class="selectedPhoto" id="selectedPhoto"></div>`
    document.getElementById('selectedPhoto').src = img;
    document.getElementById('selectionName').innerHTML = `${name}`;
}

function photoArea() {
    document.getElementById('photoArea').classList.add('d_none');
}

function slideImage(direction, index) {
    if (direction === 'left') {
        index = index - 1;
        if (index < 0) {
            index = attachmentsToArray.length - 1;
        }
        let selectedImage = attachmentsToArray[index];
        showFile(selectedImage.data, selectedImage.name, index);
    } else {
        index = index + 1;
        if (index === attachmentsToArray.length) {
            index = 0;
        }
        let selectedImage = attachmentsToArray[index];
        showFile(selectedImage.data, selectedImage.name, index);
    }

}


function downloadFile(index) {

    let selectedImage = attachmentsToArray[index];
    let url = selectedImage.data;

    const link = document.createElement('a');

    link.href = url;

    link.download = selectedImage.name;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}