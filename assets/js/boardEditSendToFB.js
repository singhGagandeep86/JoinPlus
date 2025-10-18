/**
 * Loads contact data based on the provided object data.
 */
function loadContact(objData) {
    fetchContact("/contact", objData)
}

/**
 * Fetches contact data from the specified Firebase path and loads it.
 */
async function fetchContact(pathC, objData) {
    let firebaseUrl = await fetch(BASE_URL + pathC + ".json?auth=" + token);
    let firebaseUrlAsJson = await firebaseUrl.json();
    let firebaseData = Object.values(firebaseUrlAsJson); 
    loadContactData(firebaseData, objData)
}

/**
 * Sends a PATCH request to update data at the specified path.
 */
async function postEditData(path = "", data = {}) { 
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadnewTaskEdit();
}

async function deleteUser(path = "") { 
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "DELETE"
    });
}

/**
 * Sends edited task data to the server.
 */
function pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, contacts, numberEditElement, priority, category, contactColor, attachments) {
    postEditData(`/task/task${numberEditElement}`, {
        'contact': contacts,
        'color': color,
        'date': dueDate,
        'description': description,
        'prio': priority,
        'category': category,
        'contactcolor': contactColor,
        'title': title,
        'subtask': subtaskobj,
        'checked': checked,
        'attachments': attachments
    });
}

/**
 * Creates an empty task node in the database at the specified path.
 */
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

/**
 * Deletes a task from the database based on the provided element identifier.
 */
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


/** Moves the task to the waiting state, collects task details, and pushes data to Firebase. */
async function toWaitingSecondary(id) {
    let titleText = document.getElementById('titleText').value;
    let desText = document.getElementById('desText').value;
    let actDate = document.getElementById('dateData').value;
    let category = document.getElementById('customSelect').innerText;
    let priority = document.querySelector('input[name="priority"]:checked').value;
    let list = subTsksBoard.getElementsByTagName("li");
    let newTaskNumber = generateRandomNumber();
    let name = createContactFire();
    let checked = checkedCreate(list);
    let subtask = subtastCreate(list);
    let color = colorFirebase();
    pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id, attachmentsToArray);
    attachmentsToArray = [];
    return new Promise(resolve => setTimeout(resolve, 1700));
}

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

/** Scrolls the task contacts selection area to the left or right by a specified number of pixels.
 * @param {string} direction - The direction to scroll the selection area. Can be either 'left' or 'right'. */
function scrollContacts(direction) {
    let scrollArea = document.getElementById('initialsArea');
    let scrollPixels = 80;
    if (direction === 'left') toLeft(scrollArea, scrollPixels);
    if (direction === 'right') toRight(scrollArea, scrollPixels);
}

/** Scrolls the task contacts selection area to the left by a specified number of pixels.
 * Hides the left arrow icon if the selection area is already at the start.*/
function toLeft(scrollArea, scrollPixels) {
    document.getElementById('contactRghtScroller').classList.remove("hide");
    scrollArea.scrollLeft -= scrollPixels;
    if (scrollArea.scrollLeft <= 0)
        document.getElementById('contactLftScroller').classList.add("hide");
}


/**
 * Scrolls the task contacts selection area to the right by a specified number of pixels.
 * Shows the left arrow icon if the selection area is not already at the end.
 * Hides the right arrow icon if the selection area is already at the end*/
function toRight(scrollArea, scrollPixels) {
    document.getElementById('contactLftScroller').classList.remove("hide");
    scrollArea.scrollLeft += scrollPixels;
    if (scrollArea.scrollLeft + scrollArea.clientWidth >= scrollArea.scrollWidth)
        document.getElementById('contactRghtScroller').classList.add("hide");
}