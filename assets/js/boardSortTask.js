/**
 * Organizes tasks into designated categories and updates the UI accordingly.
 */
async function taskAdd() {
    todo();
    inProgress();
    awaits();
    done();
}

/**
 * Renders tasks in the "To-Do" category within the UI.
 */
function todo() {
    let toDoItems = filterToDoItems();
    if (toDoItems.length === 0) {
        displayEmptyTaskMessage();
    } else {
        renderTasks(toDoItems);
    }
}

/**Function for filtering “toDo” tasks */
function filterToDoItems() {
    return arrayLoad.filter(e => e['id'] === 'toDo');
}

/**Function to display a message when there are no "toDo" tasks */
function displayEmptyTaskMessage() {
    document.getElementById('toDo').innerHTML = templateTaskEmptyTodo();
}

/**Function to render the "toDo" tasks */
function renderTasks(toDoItems) {
    document.getElementById('toDo').innerHTML = '';
    toDoItems.forEach((element) => {
        renderTask(element);
    });
}

/**Function to view a single "toDo" task and add contacts and subtasks if necessary */
function renderTask(element) {
    let contacts = element.contactcolor ? Object.values(element.contactcolor) : null;
    let contactName = element.contact ? Object.values(element.contact) : null;
    let checkBoxObject = element.checked ? Object.values(element.checked) : null;
    document.getElementById('toDo').innerHTML += templateTaskHTML(element);
    if (element.subtask === null) {
        loadContactTask(element, contacts, contactName);
    } else {
        processSubtasks(element, contacts, contactName, checkBoxObject);
    }
}

/**Function for processing subtasks and contacts for "ToDo" tasks */
function processSubtasks(element, contacts, contactName, checkBoxObject) {
    let checkedCount = checkBoxObject ? checkBoxObject.filter(e => e === true).length : 0;
    subtaskBar(element, checkedCount);
    loadContactTask(element, contacts, contactName);
}

/**
 * Renders tasks in the "In-Progress" category within the UI.
 */
function inProgress() {
    let inProgressItems = filterInProgressItems();
    if (inProgressItems.length === 0) {
        displayEmptyProgressMessage();
    } else {
        renderInProgressTasks(inProgressItems);
    }
}

/**Function for filtering “in progress” tasks */
function filterInProgressItems() {
    return arrayLoad.filter(e => e['id'] === 'progress');
}

/**Function to display a message when there are no "in progress" tasks */
function displayEmptyProgressMessage() {
    document.getElementById('progress').innerHTML = templateTaskEmptyInProegress();
}

/**Function to render the "in progress" tasks */
function renderInProgressTasks(inProgressItems) {
    document.getElementById('progress').innerHTML = '';
    inProgressItems.forEach((element) => {
        renderInProgressTask(element);
    });
}

/**Function to view a single "in progress" task and add contacts and subtasks if necessary */
function renderInProgressTask(element) {
    let contacts = element.contactcolor ? Object.values(element.contactcolor) : null;
    let contactName = element.contact ? Object.values(element.contact) : null;
    let checkBoxObject = element.checked ? Object.values(element.checked) : null;
    document.getElementById('progress').innerHTML += templateTaskHTML(element);
    if (element.subtask === null) {
        loadContactTask(element, contacts, contactName);
    } else {
        processProgressSubtasks(element, contacts, contactName, checkBoxObject);
    }
}

/**Function for processing subtasks and contacts for "in Progress" tasks */
function processProgressSubtasks(element, contacts, contactName, checkBoxObject) {
    let checkedCount = checkBoxObject ? checkBoxObject.filter(e => e === true).length : 0;
    subtaskBar(element, checkedCount);
    loadContactTask(element, contacts, contactName);
}


/**
 * Renders tasks in the "Awaiting" category within the UI.
 */
function awaits() {
    let awaitItems = filterAwaitItems();
    if (awaitItems.length === 0) {
        displayEmptyAwaitMessage();
    } else {
        renderAwaitTasks(awaitItems);
    }
}

/**Function for filtering “await” tasks */
function filterAwaitItems() {
    return arrayLoad.filter(e => e['id'] === 'await');
}

/**Function to display a message when there are no "await" tasks */
function displayEmptyAwaitMessage() {
    document.getElementById('await').innerHTML = templateTaskEmptyAwait();
}

/**Function to render the "await" tasks */
function renderAwaitTasks(awaitItems) {
    document.getElementById('await').innerHTML = '';
    awaitItems.forEach((element) => {
        renderAwaitTask(element);
    });
}

/**Function to view a single "await" task and add contacts and subtasks if necessary */
function renderAwaitTask(element) {
    let contacts = element.contactcolor ? Object.values(element.contactcolor) : null;
    let contactName = element.contact ? Object.values(element.contact) : null;
    let checkBoxObject = element.checked ? Object.values(element.checked) : null;
    document.getElementById('await').innerHTML += templateTaskHTML(element);
    if (element.subtask === null) {
        loadContactTask(element, contacts, contactName);
    } else {
        processAwaitSubtasks(element, contacts, contactName, checkBoxObject);
    }
}

/**Function for processing subtasks and contacts for "await" tasks */
function processAwaitSubtasks(element, contacts, contactName, checkBoxObject) {
    let checkedCount = checkBoxObject ? checkBoxObject.filter(e => e === true).length : 0;
    subtaskBar(element, checkedCount);
    loadContactTask(element, contacts, contactName);
}

/**
 * Renders tasks in the "Done" category within the UI.
 */
function done() {
    let doneItems = filterDoneItems();
    if (doneItems.length === 0) {
        displayEmptyDoneMessage();
    } else {
        renderDoneTasks(doneItems);
    }
}

/**Function for filtering “done” tasks */
function filterDoneItems() {
    return arrayLoad.filter(e => e['id'] === 'done');
}

/**Function to display a message when there are no "done" tasks */
function displayEmptyDoneMessage() {
    document.getElementById('done').innerHTML = templateTaskEmptyDone();
}

/**Function to render the "done" tasks */
function renderDoneTasks(doneItems) {
    document.getElementById('done').innerHTML = '';
    doneItems.forEach((element) => {
        renderDoneTask(element);
    });
}

/**Function to view a single "done" task and add contacts and subtasks if necessary */
function renderDoneTask(element) {
    let contacts = element.contactcolor ? Object.values(element.contactcolor) : null;
    let contactName = element.contact ? Object.values(element.contact) : null;
    let checkBoxObject = element.checked ? Object.values(element.checked) : null;
    document.getElementById('done').innerHTML += templateTaskHTML(element);
    if (element.subtask === null) {
        loadContactTask(element, contacts, contactName);
    } else {
        processDoneSubtasks(element, contacts, contactName, checkBoxObject);
    }
}

/**Function for processing subtasks and contacts for "done" tasks */
function processDoneSubtasks(element, contacts, contactName, checkBoxObject) {
    let checkedCount = checkBoxObject ? checkBoxObject.filter(e => e === true).length : 0;
    subtaskBar(element, checkedCount);
    loadContactTask(element, contacts, contactName);
}

/**
 * Initiates the dragging of a specified element.
 * @param {number} number - The index of the element being dragged.
 * @param {HTMLElement} element - The DOM element that is being dragged.
 */
function startDragging(number, element) {
    draggedElement = number;
    element.classList.add('drag');
}

/**
 * Enables an element to be a valid drop target.
 * @param {DragEvent} ev - The drag event that triggered this function. 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Opens a popup to display a task based on its ID.
 * @param {string} id - The unique identifier of the task to display in the popup.
 */
function openPopUpTask(id) {
    let taskPopUp = document.getElementById('popupTaskMain');
    init();
    if (handleMediaChange(mediaQuery)) {
        window.location.href = 'task.html';
    } else {
        taskPopUp.classList.remove('d_none');
        taskPopUp.innerHTML = '';
        taskPopUp.innerHTML = templatePopUpTask(id);
        setDateDisable();
        stopAddTaskBoardArea();
    }
}

/**
 * Prevents click events from propagating when interacting with 
 * the task board's close area and the add task button.
 */
function stopAddTaskBoardArea() {
    let area = document.getElementById('CloseArea');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    let button = document.getElementById('btnAddTaskBoard');
    button.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

/**
 * Handles media query changes and redirects to the task page if 
 * @param {MediaQueryListEvent} e - The event object containing information
 * about the media query change.
 */
function handleMediaChange(e) {
    if (e.matches) {
        window.location.href = 'task.html';
    }
}

/**
 * Closes the task popup and resets the necessary states.
 */
function closePopUpTask() {
    resetAll();
    let button = document.getElementById('btnTaskPopupcloseArea');
    button.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    let taskPopUp = document.getElementById('popupTaskMain');
    taskPopUp.classList.add('d_none');
}

/**
 * Updates the subtask progress bar for a given task element.

 */
function subtaskBar(element, checkedCount) {
    let rangeId = `subtaskRange-${element['number']}`;
    let range = document.getElementById(rangeId);
    let subtaskCount = element.subtask ? Object.keys(element.subtask).length : 0;
    if (subtaskCount === 0) {
        range.innerHTML = '';
    } else {
        range.innerHTML = templateRange(subtaskCount, checkedCount);
    }
}

/**
 * Loads and displays contact information for a given task element. 
 * @param {Object} element - The task object containing the task details.
 */
function loadContactTask(element, contacts, contactName) {
    let contactpic = `contact-${element['number']}`
    let taskContact = document.getElementById(contactpic);
    let color = contacts;
    if (color == null && contactName == null) {
        taskContact.innerHTML = '';
    } else {
        for (let i = 0; i < color.length; i++) {
            let colors = color[i];
            if (i < contactName.length) {
                
                let contact = contactName[i];
                let findIndex = allContactsArray.find(e => e.number == contact.number);
                if (findIndex.pic) {
                    taskContact.innerHTML += templateContactWithPic(findIndex.pic, colors);
                } else {
                    let initials = extrahiereInitialen(contactName[i].name);
                    taskContact.innerHTML += templateContact(colors, initials, i);
                }
            }
        }
    }
}

/**
 * Checks for overflow in the contact area of a task and sets an onclick event.
 * This function examines the dimensions of the contact area for a given 
 * @param {number} taskNumber - The unique identifier for the task to check.
 */
function checkForOverflow(taskNumber) {
    let contactArea = document.getElementById(`contactAreaPic-${taskNumber}`);
    if (contactArea.scrollHeight > contactArea.clientHeight || contactArea.scrollWidth > contactArea.clientWidth) {
        contactArea.onclick = function (event) {
            event.stopPropagation();
        };
    } else {
        contactArea.onclick = null;
    }
}

/**
 * Extracts initials from a given contact name.
 * @param {string} contactName - The full name of the contact from which to extract initials.
 */
function extrahiereInitialen(contactName) {
    if (!contactName) return '';
    for (let i = 0; i < contactName.length; i++) {
        let nameParts = contactName.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}

function openContact() {
    let userId = sessionStorage.getItem('uid');
    let userObject = userData.filter(e => e['uid'] === userId);
    if (userObject == '') {
        userObject = [{
            "email": "",
            "name": "Guest User",
            "uid": userId,
            "pathNumber": "",
            "phone": ""
        }]
    }
    let contactPopUp = document.getElementById('popupContact');
    contactPopUp.classList.remove('d_none');
    contactPopUp.innerHTML = editContactTemp();
    getOperator(userObject);
}