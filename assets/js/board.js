let path = "";
let data = {};
let url = '';
let arrayLoad = [];
let searchArray = [];
let draggedElement;
let mediaQuery = window.matchMedia("(max-width: 1100px)");
let toggle = 0;

/**
 * Loads initial task data and user data asynchronously.
 */
async function load() {
    await loadData("/task");
    fetchUserData('/user');
}

/**
 * Constructs a full URL for accessing the database with the provided path and authentication token.
 */
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches task data from the database at the specified path, initializes with empty data if none exists,
 */
async function loadData(path) {
    let response = await fetch(BASE_URL + path + ".json?auth=" + token);
    let responsetoJson = await response.json();
    if (responsetoJson === null) {
        await createEmptyTaskNode(path);
    } else {
        let taskArray = Object.values(responsetoJson);
        for (let i = 0; i < taskArray.length; i++) {
            arrayLoad.push(taskArray[i]);
        }
    }
    taskAdd();
}

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
 * @param {Object} element - The task object containing subtask information.
 * @param {number} checkedCount - The count of completed subtasks.

 */
function subtaskBar(element, checkedCount) {
    let rangeId = `subtaskRange-${element['number']}`;
    let range = document.getElementById(rangeId);
    let subtaskCount = Object.keys(element.subtask).length
    range.innerHTML = templateRange(subtaskCount, checkedCount);
}

/**
 * Loads and displays contact information for a given task element. 
 * @param {Object} element - The task object containing the task details.
 * @param {Array|null} contacts - An array of contact color identifiers or null.
 * @param {Array|null} contactName - An array of contact names or null.
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
            let initials = extrahiereInitialen(contactName[i]);
            taskContact.innerHTML += templateContact(colors, initials, i);
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
    for (let i = 0; i < contactName.length; i++) {
        let nameParts = contactName.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}

/**
 * Opens a small popup to display task information.
 * @param {number} i - The index of the task whose information is to be displayed.
 */
function openPopUpTaskSmall(i) {
    let info = document.getElementById('popupTaskInfo');
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    let objDateTask = createobjFromElement(i);
    info.innerHTML = templateTaskSmallInfo(objDateTask);
    time(objDateTask);
    addcontactInfo(objDateTask);
    addSubtaskInfo(objDateTask);
    let area = document.getElementById('closeAreaInfo');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

/**
 * This function filters the global array `arrayLoad` to find a task
 * matching the specified index. It returns the corresponding task
 * @param {number} i - The index of the task to retrieve.
 */
function createobjFromElement(i) {
    let objDataTasksmall = arrayLoad.filter(e => e['number'] == i);
    let elementfromTask = '';
    for (let i = 0; i < objDataTasksmall.length; i++) {
        elementfromTask = objDataTasksmall[i];
    }
    return elementfromTask
}

/**
 * Closes the small task popup by adding a 'd_none' class to the popup element.
 */
function closePopUpTaskSmall() {
    document.getElementById('popupTaskInfo').classList.add('d_none');
}

/**
 * Toggles the visibility of the task switch popup.
 * It updates the arrow icon to indicate the current state of the popup.
 * @param {number|string} element - The identifier of the task element for which the switch popup is opened.
 */
function openPopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    let arrow = document.getElementById('arrowSwitch' + element);
    let objData = createobjFromElement(element);
    let id = objData.id;
    toggleOpenTaskSwitch(select, arrow, element, id );
    let area = document.getElementById('popupTaskSwitch' + element);
    area.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

/** this function toggle the open task  */
function toggleOpenTaskSwitch(select, arrow, element, id ) {
    if (toggle === 0) {
        select.classList.remove('d_none');
        arrow.classList.add('arrowTaskImg');
        select.innerHTML = dataSwitch(id, element);
        toggle = 1;
    } else if (toggle === 1) {
        closePopUpTaskSwitch(element);
        arrow.classList.remove('arrowTaskImg');
        toggle = 0;
    }
}
/**
 * This function hides the popup that allows switching task options based on the provided element ID.
 * @param {number|string} element - The identifier of the task element for which the switch popup is closed.
 */
function closePopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    select.classList.add('d_none');
}

/**
 * Switches the task to a new status based on the provided task ID.
 * This function determines the target status of a task (e.g., 'toDo', 'progress', 'await', or 'done')
 * @param {string} id - The current status ID of the task.
 * @param {number|string} element - The identifier of the task element to be moved.
 */
function dataSwitch(id, element) {
    if ('toDo' == id) {
        return moveTaskTo1(element);
    } else if ('progress' == id) {
        return moveTaskTo2(element);
    } else if ('await' == id) {
        return moveTaskTo3(element);
    } else {
        return moveTaskTo4(element);
    }
}

/**
 * Changes the ID of a task and reloads the task data.
 * updates the UI by removing the arrow indicator, and reloads the task data from the server.
 * @param {string} value - The new ID value to assign to the task.
 * @param {number|string} element - The identifier of the task element to be updated.
 */
async function changeIdTaskValue(value, element) {
    let arrow = document.getElementById('arrowSwitch' + element);
    await changeIdTask(value, element);
    arrayLoad = [];
    closePopUpTaskSwitch(element);
    arrow.classList.remove('arrowTaskImg');
    await loadData("/task");
}

/**
 * This asynchronous function sends a request to update the ID of a task identified by its element number.
 * It constructs the appropriate database URL, prepares the data for the update, and sends the update request.
 * @param {string} value - The new ID value to assign to the task.
 * @param {number|string} element - The identifier of the task element whose ID is to be changed.
 */
async function changeIdTask(value, element) {
    let path = `/task/task${element}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: value };
    await postDataId(url, idChange);
}

/**
 * This function retrieves the date from a task object, formats it from "YYYY-MM-DD" 
 * @param {Object} objDateTask - The task object containing the date information.
 * @param {string} objDateTask.date - The date of the task in the format "YYYY-MM-DD".
 */
function time(objDateTask) {
    let dateArea = document.getElementById('dateAreaInfo');
    let times = objDateTask.date;
    if (times) {
        let [year, month, day] = times.split('-');
        let formattedDate = `${day}-${month}-${year}`;
        let dateReplace = formattedDate.replace(/-/g, "/");
        dateArea.innerHTML = dateReplace;
    }
}

/**
 * Adds contact information to the contact area for a given task.
 * This function retrieves contact names and their corresponding colors from the 
 * @param {Object} objDateTask - The task object containing contact information.
 * @param {Array<string>} [objDateTask.contact] - An array of contact names.
 * @param {Array<string>} [objDateTask.contactcolor] - An array of corresponding colors for the contacts.
  */
function addcontactInfo(objDateTask) {
    let contactArea = document.getElementById('contactAreaInfo');
    let contactName = objDateTask.contact ? Object.values(objDateTask.contact) : null;
    let contactscolor = objDateTask.contactcolor ? Object.values(objDateTask.contactcolor) : null;
    contactArea.innerHTML = '';
    if (contactName == null) {
        contactArea.innerHTML = '';
        contactArea.classList.add('d_none')
    } else {
        for (let i = 0; i < contactName.length; i++) {

            let initials = extrahiereInitialen(contactName[i])
            contactArea.innerHTML += templateContactInfo(contactscolor[i], initials, contactName[i]);
        }
    }
}

/**
 * Adds subtask information to the subtask area for a given task.
 * This function populates the subtask area with subtasks from the provided task object.
 * @param {Object} objDateTask - The task object containing subtask information.
 * @param {Object} [objDateTask.subtask] - An object representing subtasks associated with the task.
 * @param {Array<boolean>} [objDateTask.checked] - An array indicating whether each subtask is checked.
 */
function addSubtaskInfo(objDateTask) {
    let subtaskInput = document.getElementById('subtaskArea');
    let subtaskEmpty = document.getElementById('subtaskEmtpy');
    subtaskInput.innerHTML = '';
    if (!objDateTask.subtask) {
        subtaskInput.innerHTML = '';
        subtaskEmpty.classList.add('d_none')
    } else if (Object.values(objDateTask.subtask).length === 0 && Object.values(objDateTask.checked) === 0) {
        subtaskInput.innerHTML = '';
    } else {
        let subtaskTitle = Object.values(objDateTask.subtask);
        let subtastChecked = Object.values(objDateTask.checked);
        for (let j = 0; j < subtaskTitle.length; j++) {
            let element = subtaskTitle[j];
            subtaskInput.innerHTML += templateSubtask(element, objDateTask, j);
            checked(subtastChecked);
        }
    }
}

/**
 * This function updates the ID of a task based on the provided element, which represents
 * the target category. It also posts the updated task data and refreshes the displayed tasks.
 * @param {string} element - The new category ID to which the task will be moved. 
 *                           This can be 'toDo', 'progress', 'await', or 'done'.
 */
function moveTo(element,) {
    let elementArray = arrayLoad.filter(e => e['number'] == draggedElement);
    for (let i = 0; i < elementArray.length; i++) {
        let objData = elementArray[i];
        objData.id = element;
        let changeId = objData;
        taskAdd();
        postId(element, changeId);
    }
}

/**
 * This function constructs the URL for the specific task based on its number,
 * then sends a POST request to update the task's ID to the specified element.
 * @param {string} element - The new ID to assign to the task.
 * @param {Object} changeId - The object representing the task that is being updated.
 * @param {number} changeId.number - The unique number identifying the task.
 */
async function postId(element, changeId) {
    let number = changeId.number;
    let path = `/task/task${number}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: element };
    await postDataId(url, idChange);
}

/**
 * This function takes a URL and a data object, then sends the data to the specified URL
 * using the PATCH method to update the task's information in the database.
 * @param {string} url - The URL of the task to be updated in the database.
 * @param {Object} data - The data to be sent in the request body.
 */
async function postDataId(url, data) {
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

/**
 * This function retrieves the checked state of a specific checkbox, constructs the
 * corresponding URL to update the task's subtask status in the database, and then
 * @param {number} i - The index of the main task in the array.
 * @param {number} j - The index of the subtask in the array.
 */
async function inputCheckBoxInfo(i, j) {
    let checkboxId = `checkbox-${i}-${j}`;
    let checkbox = document.getElementById(checkboxId);
    let path = `/task/task${i}/checked`;
    let url = getDatabaseUrl(path);
    let upData = { [`task${j + 1}`]: checkbox.checked };
    await postDataCheck(url, upData);
    arrayLoad = [];
    load();
}

/**
 * Sends a PATCH request to update data in the database. 
 * This function takes a URL and a data object, converts the data object to a JSON string,
 * @param {string} url - The URL endpoint for the PATCH request, typically pointing to a specific resource in the database.
 * @param {Object} data - The data to be updated in the database.
 */
async function postDataCheck(url, data) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

/**
 * Sets the checked state of checkbox elements based on the provided array.
 * @param {boolean[]} subtastChecked - An array of boolean values indicating
 */
function checked(subtastChecked) {
    let checkboxes = document.getElementsByName('subtask');
    for (let i = 0; i < subtastChecked.length && i < checkboxes.length; i++) {
        checkboxes[i].checked = subtastChecked[i];
    }
}


function search() {
    let inputSearch = document.getElementById('search');
    let searchArray = arrayLoad.filter(item =>
        item['title'].toLowerCase().includes(inputSearch.value.toLowerCase()) ||
        item['description'].toLowerCase().includes(inputSearch.value.toLowerCase())
    );
    searchStart(inputSearch, searchArray);
}

/**
 * Initiates a search based on the input value and updates the task list accordingly.
 * This function checks the length of the input search value and determines 
 * @param {HTMLInputElement} inputSearch - The input element containing the search value.
 * @param {Array} searchArray - An array of tasks or items to search through. 
 */
function searchStart(inputSearch, searchArray) {
    if (searchArray == '') {
        document.getElementById('emptySearchOn').classList.remove('d_none');
    } else if (inputSearch.value.length < 3 && inputSearch.value == 0) {
        document.getElementById('emptySearchOn').classList.add('d_none');
        arrayLoad = [];
        load();
    } else if ((inputSearch.value.length > 2)) {
        document.getElementById('emptySearchOn').classList.add('d_none');
        arrayLoad = searchArray;
        taskAdd();
    }
}

/**
 * Highlights an element by adding a specific CSS class to it.
 * @param {string} id - The ID of the element to be highlighted.
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes the highlight from an element by removing a specific CSS class.
 * @param {string} id - The ID of the element from which the highlight should be removed.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Adds a task to the task board after validation checks. 
 * @param {Object} id - The object representing the task to be added. 
 */
async function addTaskboard(id) {
    let idAdd = id.id;
    if (checkValidation()) {
        document.getElementById('taskDoneIcon').classList.remove("subTaskIcon");
        await toWaiting(idAdd);
        arrayLoad = [];
        closePopUpTask();
        load();
        document.getElementById('taskDoneIcon').classList.add("subTaskIcon");
    }

}