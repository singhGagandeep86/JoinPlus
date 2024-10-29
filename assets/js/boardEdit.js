let pathC = '';

/**
 * Loads and displays contact data in the contact drop area.
 */
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

/**
 * Loads and displays an empty state for contact data in the contact drop area.
 */
function loadContactEmpty(contactData, firebaseData) {
    let contactArea = document.getElementById('contactDropArea');
    for (let j = 0; j < firebaseData.length; j++) {
        let contactName = contactData[j];
        let color = firebaseData[j].color;
        let initials = extrahiereInitialen(contactName);
        contactArea.innerHTML += checkboxContactTemplateEmpty(contactName, initials, color);
    }
}

/**
 * Loads and displays the initials of the contacts associated with a given task.
 */
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

/**
 * Extracts and returns an array of contact names from the given Firebase data.
 */
function contactArray(firebaseData) {
    let elementContact = [];
    for (let i = 0; i < firebaseData.length; i++) {
        elementContact.push(firebaseData[i].name);
    }
    return elementContact;
}

/**
 * Opens the edit popup for a specific task and populates it with the task's details.
 */
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

/**
 * Sets the minimum allowable date for the date input field to today's date.
 */
function dateVali() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('dateEditEnter').setAttribute('min', today);
}

/**
 * Loads the necessary data for editing a task and initializes the UI components.
 */
function loadEditData(objData, prioCheck) {
    loadContact(objData);
    descriptionData(objData);
    substartDiv();
    loadSubs(objData);
    priorityEditCheck(prioCheck);
    initialsLoad(objData)
    dateVali();
}

/**
 * Toggles the visibility of the contact dropdown menu and handles contact selection.
 */
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

/**
 * Closes the contact dropdown menu when clicking outside of it.
 */
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

/**
 * Loads and displays subtasks in the specified subtask area.
 */
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

/**
 * Sets the value of the description textarea to the provided task description.
 */
function descriptionData(objData) {
    document.querySelector('.textAreaData').value = objData.description;
}

/**
 * Sets the checked state of the priority radio buttons based on the provided priority value.
 */
function priorityEditCheck(prioCheck) {
    let prio = document.getElementsByName('priority');
    for (let i = 0; i < prio.length; i++) {
        if (prio[i].value === prioCheck) {
            prio[i].checked = true;
            break;
        }
    }
}

/**
 * Retrieves the selected contacts from the contact dropdown.
 */
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

/**
 * Initializes and displays the selected contacts' initials in the initials area.
 */
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

/**
 * Initializes the subtask input area by clearing its current content
 */
function substartDiv() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskstart();
}

/**
 * Clears the current content of the subtask input area and populates it
 * with a new subtask template.
 */
function subtastAdd() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskAdd();
}

/**
 * Resets the subtask input area by invoking the substartDiv function.
 */
function deletInput() {
    substartDiv();
}

/**
 * Adds a new subtask based on the value entered in the subtask input field.
 */
function addInputSubtastk() {
    let input = document.getElementById('subInput');
    let inputValue = input.value.trim();
    if (inputValue !== '') {
        loadSubtaskLi(inputValue);
        substartDiv();
    }
}

/**
 * Loads a new subtask into the subtask area of the task board.
 */
function loadSubtaskLi(inputValue) {
    let subtaskArea = document.getElementById('subTaskBoard');
    subtaskArea.innerHTML += addSubTask(inputValue);
}

/**
 * Edits a subtask by replacing its current content with an editable template.
 */
function editSubTask(liElement) {
    let currentText = liElement.querySelector('.taskText').textContent.trim().substring(2);
    liElement.innerHTML = templateSub1(currentText);
}

/**
 * Deletes a task from the list when the delete event is triggered.
 */
function deleteTask(event) {
    event.stopPropagation();
    let liElement = event.target.closest('li');
    liElement.remove();
}

/**
 * Saves the updated value of a subtask when triggered by an event.
 */
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

/**
 * Toggles the edit mode for a subtask when triggered by an event.
 */
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

/**
 * Retrieves all subtask values from the subtask list.
 */
function getAllSubTasks() {
    let subTaskElements = document.querySelectorAll('#subTaskBoard .liSubTask');
    let subTaskValues = [];
    for (let i = 0; i < subTaskElements.length; i++) {
        let taskText = subTaskElements[i].querySelector('.taskText').innerText.trim().substring(2);
        subTaskValues.push(taskText);
    }
    return subTaskValues;
}

/**
 * Reads the selected priority value from a group of radio buttons.
 */
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

/**
 * Reads and collects data from the edit task form.
 */
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

/**
 * Validates the title of the task during the edit process.
 * This function checks if the title is empty. If it is, it calls the
 * `failNameEditBoard` function to handle the failure case. If the title
 * is valid (not empty), it proceeds to push the edited task data
 * using the `pushDataEdit` function.
 */
function nameValiEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority) {
    if (title === '') {
        failNameEditBoard();
        return false;
    } else {
        pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, numberEditElement, priority);
    }
}

/**
 * Clears the failure message for the task title input during the edit process.
 */
function clearFailAdd() {
    let title = document.querySelector('.titleInput').value.trim();
    if (title !== '') {
        document.getElementById('failTitleEditBoard').classList.add('d_none');
        document.getElementById('titleEditFail').classList.remove('titleInputFail');
    }
}

/**
 * Adds an error message for the title editing.
 */
function failNameEditBoard() {
    document.getElementById('titleEditFail').classList.add('titleInputFail');
    document.getElementById('failTitleEditBoard').classList.remove('d_none');
}

/**
 * Converts an array of subtasks into an object with numbered keys.
 */
function subtaskObj(subtask) {
    let subtaskobj = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        subtaskobj[`task${i + 1}`] = subtaskText;
    }
    return subtaskobj
}

/**
 * Creates an object representing the checked status of subtasks.
 */
function checkedObj(subtask) {
    let checked = {};
    for (let i = 0; i < subtask.length; i++) {
        let subtaskText = subtask[i];
        checked[`task${i + 1}`] = false;
    }
    return checked
}

/**
 * Creates an object mapping contact names to numbered keys.
 */
function nameObj(contact) {
    let contactName = {};
    for (let i = 0; i < contact.length; i++) {
        let contactData = contact[i].name;
        contactName[`contact${i + 1}`] = contactData;
    }
    return contactName
}

/**
 * Creates an object mapping contact colors to numbered keys.
 */
function colorObj(contact) {
    let color = {};
    for (let i = 0; i < contact.length; i++) {
        let contactColor = contact[i].color;
        color[`color${i + 1}`] = contactColor;
    }
    return color
}

/**
 * Loads new task data and refreshes the display.
 */
function loadnewTaskEdit() {
    arrayLoad = [];
    load();
    closePopUpTaskSmall();
}