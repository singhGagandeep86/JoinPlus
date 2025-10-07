

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

/*Checks if the contact data is null and loads either an empty state or avatars in the contact drop area.*/
function loadContactDataIf(contact, contactData, firebaseData, contactArea) {
    if (contact == null) {
        loadContactEmpty(contactData, firebaseData)
    } else {
        loadContactAvatar(contact, contactData, firebaseData, contactArea);
    }
}

/** Loads contact data with pictures in the contact drop area.*/
function loadContactAvatar(contact, contactData, firebaseData, contactArea) {
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
        renderContactAvatar(contactUser, color, initialsContact);
    }
}

/**Renders contact avatars based on the provided contact list and associated colors. Iterates through the contact list and checks if each contact 
 * has a picture. If a contact has a picture, it uses the `initialsLoadContactWithPic` function to generate the HTML,
 * otherwise it uses the `initialsLoadContact` function. */
function renderContactAvatar(contactUser, color, initialsContact) {
    for (let k = 0; k < contactUser.length; k++) {
        let contactName = contactUser[k].name;
        let colorIni = color[k];
        let filteredContact = allContactsArray.find(e => e.number == contactUser[k].number);
        if (contactUser.length > 5) document.getElementById('contactRghtScroller').classList.remove('hide');
        if (filteredContact && filteredContact.pic) {
            initialsContact.innerHTML += initialsLoadContactWithPic(filteredContact.pic, colorIni);
        } else {
            let initials = extrahiereInitialen(contactName);
            initialsContact.innerHTML += initialsLoadContact(initials, colorIni);
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
    });
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

/** Sets the value of the hidden category select element and the custom category select element
 * text content to the provided category value from the task object.*/
function categorieSelect(objData) {
    let category = objData.category;
    let categoryOption = document.getElementById('hiddenSelect');
    let customSelect = document.getElementById('customSelect');
    categoryOption.value = category;
    customSelect.innerText = category;
}

/**Populates the attachment area with the provided task object's attachments.
 * If no attachments are provided, it clears the attachment area section and hides the attachment area.
 * If attachments are provided, it populates the attachment area section with the provided attachment names and files.*/
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
            fileList.innerHTML += attachFilesTemplate(index, attachment.data, attachment.name);
        }
    }
}
/** Populates the attachment area with the provided task object's attachments.
 * If no attachments are provided, it clears the attachment area section and hides the attachment area.
 * If attachments are provided, it populates the attachment area section with the provided attachment names and files. */
function loadTheAttachments() {
    let fileListNew = document.getElementById('file-List');
    let removeAllNew = document.getElementById('remove-All');
    fileListNew.innerHTML = '';
    if (attachmentsToArray.length === 0) {
        removeAllNew.classList.add('selectHide');
    } else {
        removeAllNew.classList.remove('selectHide');
        for (let index = 0; index < attachmentsToArray.length; index++) {
            const attachment = attachmentsToArray[index];
            fileListNew.innerHTML += attachTheFilesTemplate(index, attachment.data, attachment.name);
        }
    }
}

/**
 * Removes an attachment file from the list of attachments.
 */
function removeTheAttachmentFile(event, name) {
    event.stopPropagation();
    let filter = attachmentsToArray.indexOf(attachmentsToArray.filter(attachment => attachment.name == name)[0]);
    let fileListNew = document.getElementById('file-List');
    let removeAllNew = document.getElementById('remove-All');
    attachmentsToArray.splice(filter, 1);
    fileListNew.innerHTML = '';
    for (let i = 0; i < attachmentsToArray.length; i++) {
        const attachment = attachmentsToArray[i];
        const name = attachment.name;
        const base64 = attachment.data;
        fileListNew.innerHTML += attachTheFilesTemplate(i, base64, name);
    }
    if (attachmentsToArray.length === 0) {
        removeAllNew.classList.add('selectHide');
    }
}

/**Clears the attachment area section and hides the attachment area.*/
function removeAllAttachments() {
    attachmentsToArray = [];
    fileList.innerHTML = '';
    removeAll.classList.add("selectHide");
}

/**Removes an attachment file from the list of attachments.*/
function removeAttachmentFile(event, name) {
    event.stopPropagation();
    let filter = attachmentsToArray.indexOf(attachmentsToArray.filter(attachment => attachment.name == name)[0]);
    attachmentsToArray.splice(filter, 1);
    fileList.innerHTML = '';
    for (let i = 0; i < attachmentsToArray.length; i++) {
        const attachment = attachmentsToArray[i];
        const name = attachment.name;
        const base64 = attachment.data;
        fileList.innerHTML += attachFilesTemplate(i, base64, name);
    }
    if (attachmentsToArray.length === 0) {
        removeAll.classList.add('selectHide');
    }
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
            renderSelectedContactAvatar(checkContact[i], initialsContact);
        }
    }
}

/**Renders the initials of the selected contact in the initials area.*/
function renderSelectedContactAvatar(checkContact, initialsContact) {
    let contactName = checkContact.name;
    let color = checkContact.color;
    let initials = extrahiereInitialen(contactName);
    let number = checkContact.number;
    let filteredContact = allContactsArray.find(e => e.number == number);
    if (filteredContact && filteredContact.pic) {
        initialsContact.innerHTML += initialsLoadContactWithPic(filteredContact.pic, color);
    } else {
        initialsContact.innerHTML += initialsLoadContact(initials, color);
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

/** Generates an HTML template for a file attachment. */
function filesTemplate(index, img, name, size) {
    return `<div class="file-container">
    <div class="removeAttach"><img src="../img/Closewhite.png"></div>
    <img src=${img}>
    <div class="file-name">${name}(${size})</div>
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

/**Generates a string representing the color associated with the task category. */
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

/**Creates an object mapping contact names to numbered keys and their corresponding numbers.*/
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

/** Handles file drop event in task edit page. Prevents default event handler and removes active class from picker area.
 * Iterates over the dropped files and checks if the file is an image. If the file is not an image, an error message is displayed.
 * If the file is an image, it is sent to be manipulated.*/
function dropHandler(event, picker) {
    event.preventDefault();
    document.getElementById('pickerArea').classList.remove('picker-active');
    const error = document.getElementById('error');
    error.innerHTML = '';
    [...event.dataTransfer.items].forEach(async (item, i) => {
        if (item.kind === "file") {
            const file = item.getAsFile();
            if (!allowedTypes.includes(file.type)) return error.innerHTML = `<b>${file.type}</b>type is not Allowed!`;
            manipulatePickedFile(file, picker);
        }
    });
}

/** Adds the 'picker-active' class to the picker area, indicating that file drops are allowed. */
function activatePickArea(event, mode) {
    event.preventDefault();
    if (mode === 'newTask') {
        document.getElementById('pickerArea').classList.add('picker-active');
    }
    if (mode === 'editTask') {
        document.getElementById('picker-Area').classList.add('picker-active');
    }
}

/** Removes the 'picker-active' class from the picker area, indicating that file drops are no longer allowed. */
function deactivatePickArea(event, mode) {
    event.preventDefault();
    if (mode === 'newTask') {
        document.getElementById('pickerArea').classList.remove('picker-active');
    }
    if (mode === 'editTask') {
        document.getElementById('picker-Area').classList.remove('picker-active');
    }
}

/** Opens the file picker element by simulating a click event. */
function openFilePicker(picker) {
    let filesPicker = document.getElementById('filesPicker');

    if (!filesPicker) return;

    if (!filesPicker.dataset.listener) {
        filesPicker.addEventListener('change', (event) => handlepickedFiles(event, picker));
        filesPicker.dataset.listener = "true";
    }

    filesPicker.click();

}

/**Handles the file picker change event, converting the selected files to base64 strings and adding them to the attachments array.*/
function handlepickedFiles(event, picker) {
    const allFiles = event.target.files;
    let error = document.getElementById('error');
    if (error) error.innerHTML = '';
    if (allFiles.length > 0) {
        if (!allowedTypes.includes(allFiles[0].type)) return error.innerHTML = `<b>${allFiles[0].type}</b>type is not Allowed!`;
        Array.from(allFiles).forEach(async file => manipulatePickedFile(file, picker));
    }
}

/** Handles a single file picked by the user, compressing it to a base64 string and adding it to the attachments array. */
async function manipulatePickedFile(file, picker) {
    document.getElementById('error').innerHTML = '';
    const compressedBase64 = await compressImage(file, 800, 800, 0.7);
    document.createElement('img').src = compressedBase64;
    const { width, height } = await getImageDimensions(compressedBase64);
    file.width = width;
    file.height = height;
    loadAttachmentsToArray(file, compressedBase64, createSizeUnit(compressedBase64));
    if (picker === 'editTask') loadAllAttachments();
    if (picker === 'newTask') loadTheAttachments();
}

/** Adds a file to the attachments array. */
function loadAttachmentsToArray(file, compressedBase64, createSize) {
    attachmentsToArray.push({
        name: file.name,
        type: file.type,
        size: createSize,
        data: compressedBase64,
        dimensions: { 'width': `${file.width}px`, 'height': `${file.height}px` }
    });
}

/** Calculates the size of a given base64 string in kilobytes. */
function createSizeUnit(compressedBase64) {
    let stringLength = compressedBase64.length - (compressedBase64.indexOf(',') + 1);
    let sizeInKB = ((stringLength * 3) / (4096)).toFixed(2);
    return sizeInKB + "KB";
}

/** Clears the attachments array and resets the file list display. Hides the 'remove all' button. */
function removeAttachmentsToArray() {
    attachmentsToArray = [];
    fileList.innerHTML = "";
    removeAll.classList.add("selectHide");
}

/** Hides the attachments container and removes its event listeners. */
function closeAttachOverlay() {
    let attachmentsContainer = document.getElementById('attachmentsContainer');
    attachmentsContainer.classList.add('d_none');
}

/** Displays the selected image in a popup area with controls to download the image, close the popup, and navigate left and right. */
function showFile(img, name, index) {
    document.getElementById('photoArea').classList.remove('d_none');
    document.getElementById('photoArea').innerHTML = `
      <div class="imgContainer" onclick="event.stopPropagation()">
        <div class="imgHeader"><p id="selectionName"></p>
        <div class="imgHandle"><img src="../img/download.png" onClick="downloadFile(${index})"><img src="../img/Closewhite.png" onClick="photoArea()"></div></div>
        <div class="imgMover"><img src="../img/arrow-Lft-line.png" onclick='changeImage("left", ${index})'><img src="../img/arrow-right-line.png" onclick='changeImage("right", ${index})'></div>
        <img class="selectedPhoto" id="selectedPhoto"></div>`
    document.getElementById('selectedPhoto').src = img;
    document.getElementById('selectionName').innerHTML = `${name}`;
}

/** Changes the displayed image in the popup area based on the given direction and index. */
function changeImage(direction, index) {
    if (direction === 'left') {
        changeLeft(index);
    } else {
        changeRight(index);
    }
}

/** Changes the displayed image in the popup area to the left by one index. If the index is less than 0, it wraps around to the last index 
 * in the attachments array. */
function changeLeft(index) {
    index = index - 1;
    if (index < 0) {
        index = attachmentsToArray.length - 1;
    }
    let selectedImage = attachmentsToArray[index];
    showFile(selectedImage.data, selectedImage.name, index);
}
/** Changes the displayed image in the popup area to the right by one index. If the index is equal to the length of the attachments array, 
 * it wraps around to the first index. */
function changeRight(index) {
    index = index + 1;
    if (index === attachmentsToArray.length) {
        index = 0;
    }
    let selectedImage = attachmentsToArray[index];
    showFile(selectedImage.data, selectedImage.name, index);
}

/**Hides the photo area element and removes any displayed image. */
function photoArea() {
    document.getElementById('photoArea').classList.add('d_none');
}

/**Slides the image in the given direction (left or right) to the new index.*/
function slideImages(direction, index) {
    if (direction === 'left') {
        slideToLeft(index);
    } else {
        slideToRight(index);
    }
}

/** Slides the image in the photo area to the left by one index. If the index is less than 0, it wraps around to the last index in the attachments array. */
function slideToLeft(index) {
    index = index - 1;
    if (index < 0) {
        index = attachmentsToArray.length - 1;
    }
    let selectedImage = attachmentsToArray[index];
    showSelAttachment(index, selectedImage.data, selectedImage.name, 'newTask');
}

/**Slides the image in the photo area to the right by one index. If the index is equal to the length of the attachments array, it wraps around to the first index in the attachments array. */
function slideToRight(index) {
    index = index + 1;
    if (index === attachmentsToArray.length) {
        index = 0;
    }
    let selectedImage = attachmentsToArray[index];
    showSelAttachment(index, selectedImage.data, selectedImage.name, 'newTask');
}

/**Downloads the image at the given index from the attachments array. */
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

function scrollContacts(direction) {
    let scrollArea = document.getElementById('initialsArea');
    let scrollPixels = 80;
    if (direction === 'left') toLeft(scrollArea, scrollPixels);
    if (direction === 'right') toRight(scrollArea, scrollPixels);
}

function toLeft(scrollArea, scrollPixels) {
    document.getElementById('contactRghtScroller').classList.remove("hide");
    scrollArea.scrollLeft -= scrollPixels;
    if (scrollArea.scrollLeft <= 0)
        document.getElementById('contactLftScroller').classList.add("hide");
}


function toRight(scrollArea, scrollPixels) {
    document.getElementById('contactLftScroller').classList.remove("hide");
    scrollArea.scrollLeft += scrollPixels;
    if (scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth)
        document.getElementById('contactRghtScroller').classList.add("hide");
}