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
 *
 * This asynchronous function calls `loadData` to retrieve task-related data from the specified
 * server path and `fetchUserData` to fetch user information, populating relevant global variables.
 *
 * @async
 * @function load
 * @returns {Promise<void>} A promise that resolves when both task data and user data have been fetched.
 */
async function load() {
    await loadData("/task");
    fetchUserData('/user');
}

/**
 * Constructs a full URL for accessing the database with the provided path and authentication token.
 *
 * This function retrieves an authentication token from the session storage and appends it to the URL.
 * The constructed URL is used to access a specific database path securely.
 *
 * @function getDatabaseUrl
 * @param {string} path - The specific path in the database to access.
 * @returns {string} The complete URL for database access, including the authentication token as a query parameter.
 */
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches task data from the database at the specified path, initializes with empty data if none exists,
 * and populates a global array with tasks for further processing.
 *
 * This asynchronous function sends a GET request to the specified database path, expecting JSON data. 
 * If no data exists at the given path, it creates an empty task node via `createEmptyTaskNode`. 
 * When data is received, each task is added to the global `arrayLoad` array.
 *
 * @async
 * @function loadData
 * @param {string} path - The database path for loading task data.
 * @returns {Promise<void>} A promise that resolves when task data has been loaded and processed.
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
 *
 * This asynchronous function calls helper functions (`todo`, `inPorgess`, `awaits`, and `done`) 
 * to categorize and render tasks in the appropriate sections of the UI based on their status.
 *
 * @async
 * @function taskAdd
 * @returns {Promise<void>} A promise that resolves when all task categories have been processed and displayed.
 */
async function taskAdd() {
    todo();
    inPorgess();
    awaits();
    done();
}

/**
 * Renders tasks in the "To-Do" category within the UI.
 *
 * This function filters tasks with an ID of 'toDo' from the global `arrayLoad`, 
 * and displays each task within the "To-Do" section of the UI. It displays an 
 * empty task template if no "To-Do" tasks are found. For each task, it generates 
 * HTML content with appropriate details such as contacts and subtasks.
 *
 * - If a task has no subtasks, it is rendered directly.
 * - If the task has subtasks or checkboxes, the count of checked subtasks is calculated 
 *   and displayed within a progress bar.
 *
 * @function todo
 * @returns {void}
 */
function todo() {
    let toDo = arrayLoad.filter(e => e['id'] == 'toDo');
    if (toDo.length == 0) {
        document.getElementById('toDo').innerHTML = templateTaskEmptyTodo();
    } else {
        document.getElementById('toDo').innerHTML = '';
        for (let index = 0; index < toDo.length; index++) {
            let element = toDo[index];
            let contacts = element.contactcolor ? Object.values(toDo[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(toDo[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

/**
 * Renders tasks in the "In-Progress" category within the UI.
 *
 * This function filters tasks with an ID of 'progress' from the global `arrayLoad` array 
 * and displays each task within the "In-Progress" section of the UI. If no "In-Progress" 
 * tasks are found, it displays a template for an empty task state.
 *
 * - For tasks without subtasks, it directly renders the task HTML.
 * - If tasks have subtasks or checkboxes, it calculates the number of checked subtasks 
 *   to display a progress bar reflecting task completion.
 *
 * @function inPorgess
 * @returns {void}
 */
function inPorgess() {
    let inprogress = arrayLoad.filter(e => e['id'] == 'progress');
    if (inprogress.length == 0) {
        document.getElementById('progress').innerHTML = templateTaskEmptyInProegress();
    } else {
        document.getElementById('progress').innerHTML = '';
        for (let index = 0; index < inprogress.length; index++) {
            let element = inprogress[index];
            let contacts = element.contactcolor ? Object.values(inprogress[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(inprogress[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

/**
 * Renders tasks in the "Awaiting" category within the UI.
 *
 * This function filters tasks with an ID of 'await' from the global `arrayLoad` array 
 * and displays each task within the "Awaiting" section of the UI. If no tasks in the 
 * "Awaiting" category are found, it displays a template for an empty task state.
 *
 * - For tasks without subtasks, it directly renders the task HTML.
 * - If tasks have subtasks or checkboxes, it calculates the number of checked subtasks 
 *   to display a progress bar reflecting task completion.
 *
 * @function awaits
 * @returns {void}
 */
function awaits() {
    let await = arrayLoad.filter(e => e['id'] == 'await');
    if (await.length == 0) {
        document.getElementById('await').innerHTML = templateTaskEmptyAwait();
    } else {
        document.getElementById('await').innerHTML = '';
        for (let index = 0; index < await.length; index++) {
            let element = await[index];
            let contacts = element.contactcolor ? Object.values(await[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(await[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

/**
 * Renders tasks in the "Done" category within the UI.
 *
 * This function filters tasks with an ID of 'done' from the global `arrayLoad` array 
 * and displays each task in the "Done" section of the UI. If no tasks are found in 
 * this category, it displays a template indicating an empty state.
 *
 * - For tasks without subtasks, it renders the task HTML directly.
 * - For tasks with subtasks or checkboxes, it calculates the number of completed 
 *   subtasks to display a progress bar, reflecting task completion.
 *
 * @function done
 * @returns {void}
 */
function done() {
    let done = arrayLoad.filter(e => e['id'] == 'done');
    if (done.length == 0) {
        document.getElementById('done').innerHTML = templateTaskEmptyDone();
    } else {
        document.getElementById('done').innerHTML = '';
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            let contacts = element.contactcolor ? Object.values(done[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(done[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

/**
 * Initiates the dragging of a specified element.
 *
 * This function is called when the user starts dragging an element.
 * It stores the index (number) of the dragged element and adds a 
 * CSS class 'drag' to the element being dragged for styling purposes.
 *
 * @function startDragging
 * @param {number} number - The index of the element being dragged.
 * @param {HTMLElement} element - The DOM element that is being dragged.
 * @returns {void}
 */
function startDragging(number, element) {
    draggedElement = number;
    element.classList.add('drag');
}

/**
 * Enables an element to be a valid drop target.
 *
 * This function is called to prevent the default behavior of an element 
 * when an item is dragged over it. This is necessary to allow 
 * dropping items onto the element.
 *
 * @function allowDrop
 * @param {DragEvent} ev - The drag event that triggered this function.
 * @returns {void}
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Opens a popup to display a task based on its ID.
 *
 * This function initializes the popup for a specific task by retrieving 
 * the task ID and populating the popup with the appropriate content.
 * If the media query indicates a smaller screen size, it redirects to 
 * the task page instead.
 *
 * @function openPopUpTask
 * @param {string} id - The unique identifier of the task to display in the popup.
 * @returns {void}
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
        stopAddTaskBoardArea();
    }
}

/**
 * Prevents click events from propagating when interacting with 
 * the task board's close area and the add task button.
 *
 * This function adds event listeners to the close area and the 
 * add task button to stop the click events from bubbling up to 
 * parent elements, which may trigger unwanted behavior. 
 *
 * @function stopAddTaskBoardArea
 * @returns {void}
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
 * the specified media query matches.
 *
 * This function is typically used as a callback for the `MediaQueryList`
 * interface to check if the media query has changed. If it matches the 
 * specified condition, it redirects the user to the 'task.html' page.
 *
 * @function handleMediaChange
 * @param {MediaQueryListEvent} e - The event object containing information
 * about the media query change.
 * @returns {void}
 */
function handleMediaChange(e) {
    if (e.matches) {
        window.location.href = 'task.html';
    }
}

/**
 * Closes the task popup and resets the necessary states.
 *
 * This function hides the task popup by adding the 'd_none' class to it
 * and resets any relevant states or variables. It also sets up an event 
 * listener on the close button to prevent event propagation, ensuring that 
 * clicks on the button do not trigger any parent event handlers.
 *
 * @function closePopUpTask
 * @returns {void}
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
 *
 * This function modifies the inner HTML of a subtask range element,
 * displaying the progress of completed subtasks as a percentage. It 
 * uses the total count of subtasks and the count of checked subtasks 
 * to generate the progress bar template.
 *
 * @function subtaskBar
 * @param {Object} element - The task object containing subtask information.
 * @param {number} checkedCount - The count of completed subtasks.
 * @returns {void}
 */
function subtaskBar(element, checkedCount) {
    let rangeId = `subtaskRange-${element['number']}`;
    let range = document.getElementById(rangeId);
    let subtaskCount = Object.keys(element.subtask).length
    range.innerHTML = templateRange(subtaskCount, checkedCount);
}

/**
 * Loads and displays contact information for a given task element.
 *
 * This function populates the contact section of a task with 
 * relevant contact pictures and initials based on the provided 
 * contacts and contact names. If no contacts are present, it 
 * clears the contact display.
 *
 * @function loadContactTask
 * @param {Object} element - The task object containing the task details.
 * @param {Array|null} contacts - An array of contact color identifiers or null.
 * @param {Array|null} contactName - An array of contact names or null.
 * @returns {void}
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
 *
 * This function examines the dimensions of the contact area for a given 
 * task number to determine if the content overflows. If overflow is detected, 
 * it adds an event listener to prevent click events from propagating. 
 * If no overflow is detected, it removes the event listener.
 *
 * @function checkForOverflow
 * @param {number} taskNumber - The unique identifier for the task to check.
 * @returns {void}
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
 *
 * This function takes a contact name as a string, splits it into parts,
 * and constructs a string of the initials, which are the first letters
 * of each part of the name, converted to uppercase.
 *
 * @function extrahiereInitialen
 * @param {string} contactName - The full name of the contact from which to extract initials.
 * @returns {string} The initials of the contact name in uppercase.
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
 *
 * This function retrieves the task information for a specified task
 * index, creates an object representing the task, and populates the
 * popup with the corresponding task details. It also sets up event
 * listeners for closing the popup.
 *
 * @function openPopUpTaskSmall
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
 * Creates an object representing a task from the given index.
 *
 * This function filters the global array `arrayLoad` to find a task
 * matching the specified index. It returns the corresponding task
 * object if found.
 *
 * @function createobjFromElement
 * @param {number} i - The index of the task to retrieve.
 * @returns {Object|null} The task object corresponding to the index, or null if not found.
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
 *
 * This function hides the task information popup when called. 
 * It modifies the CSS classes of the element with the ID 'popupTaskInfo'
 * to ensure it is not displayed on the screen.
 *
 * @function closePopUpTaskSmall
 */
function closePopUpTaskSmall() {
    document.getElementById('popupTaskInfo').classList.add('d_none');
}

/**
 * Toggles the visibility of the task switch popup.
 *
 * This function opens or closes a popup for switching task options based on the provided element ID.
 * It updates the arrow icon to indicate the current state of the popup.
 *
 * @param {number|string} element - The identifier of the task element for which the switch popup is opened.
 * 
 * @example
 * // To open or close the popup for task element with ID 1
 * openPopUpTaskSwitch(1);
 */
function openPopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    let arrow = document.getElementById('arrowSwitch' + element);
    let objData = createobjFromElement(element);
    let id = objData.id;
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
    let area = document.getElementById('popupTaskSwitch' + element);
    area.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}
/**
 * Closes the task switch popup for the specified element.
 *
 * This function hides the popup that allows switching task options based on the provided element ID.
 *
 * @param {number|string} element - The identifier of the task element for which the switch popup is closed.
 * 
 * @example
 * // To close the popup for task element with ID 1
 * closePopUpTaskSwitch(1);
 */
function closePopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    select.classList.add('d_none');
}

/**
 * Switches the task to a new status based on the provided task ID.
 *
 * This function determines the target status of a task (e.g., 'toDo', 'progress', 'await', or 'done')
 * and calls the appropriate function to move the task to that status.
 *
 * @param {string} id - The current status ID of the task.
 * @param {number|string} element - The identifier of the task element to be moved.
 * @returns {Function} The result of the function that moves the task to the new status.
 * 
 * @example
 * // To switch the task with element ID 1 to 'progress'
 * let result = dataSwitch('toDo', 1);
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
 *
 * This asynchronous function updates the ID of a specified task,
 * updates the UI by removing the arrow indicator, and reloads the task data from the server.
 *
 * @async
 * @param {string} value - The new ID value to assign to the task.
 * @param {number|string} element - The identifier of the task element to be updated.
 * @returns {Promise<void>} A promise that resolves when the task ID has been changed and data is reloaded.
 * 
 * @example
 * // To change the ID of the task with element ID 1 to a new value 'inProgress'
 * await changeIdTaskValue('inProgress', 1);
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
 * Changes the ID of a specific task in the database.
 *
 * This asynchronous function sends a request to update the ID of a task identified by its element number.
 * It constructs the appropriate database URL, prepares the data for the update, and sends the update request.
 *
 * @async
 * @param {string} value - The new ID value to assign to the task.
 * @param {number|string} element - The identifier of the task element whose ID is to be changed.
 * @returns {Promise<void>} A promise that resolves when the ID has been successfully updated in the database.
 * 
 * @example
 * // To change the ID of the task with element ID 1 to a new value 'inProgress'
 * await changeIdTask('inProgress', 1);
 */
async function changeIdTask(value, element) {
    let path = `/task/task${element}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: value };
    await postDataId(url, idChange);
}

/**
 * Displays the formatted date of a task in the specified HTML element.
 *
 * This function retrieves the date from a task object, formats it from "YYYY-MM-DD" 
 * to "DD/MM/YYYY", and updates the inner HTML of the date display area.
 *
 * @param {Object} objDateTask - The task object containing the date information.
 * @param {string} objDateTask.date - The date of the task in the format "YYYY-MM-DD".
 * 
 * @example
 * // To display the date of a task in the date area
 * time({ date: '2024-10-27' });
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
 *
 * This function retrieves contact names and their corresponding colors from the 
 * provided task object, clears the current contact area, and populates it with 
 * new contact entries. If no contacts are found, it hides the contact area.
 *
 * @param {Object} objDateTask - The task object containing contact information.
 * @param {Array<string>} [objDateTask.contact] - An array of contact names.
 * @param {Array<string>} [objDateTask.contactcolor] - An array of corresponding colors for the contacts.
 *
 * @example
 * // To add contact information for a task
 * addcontactInfo({
 *     contact: ['Alice Smith', 'Bob Johnson'],
 *     contactcolor: ['#FF5733', '#33FF57']
 * });
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
 *
 * This function populates the subtask area with subtasks from the provided task object.
 * If there are no subtasks, it clears the area and hides the empty subtask indicator.
 *
 * @param {Object} objDateTask - The task object containing subtask information.
 * @param {Object} [objDateTask.subtask] - An object representing subtasks associated with the task.
 * @param {Array<boolean>} [objDateTask.checked] - An array indicating whether each subtask is checked.
 *
 * @example
 * // To add subtask information for a task
 * addSubtaskInfo({
 *     subtask: {
 *         1: 'Subtask 1',
 *         2: 'Subtask 2'
 *     },
 *     checked: [true, false]
 * });
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
 * Moves a task to a specified category by updating its ID.
 *
 * This function updates the ID of a task based on the provided element, which represents
 * the target category. It also posts the updated task data and refreshes the displayed tasks.
 *
 * @param {string} element - The new category ID to which the task will be moved. 
 *                           This can be 'toDo', 'progress', 'await', or 'done'.
 *
 * @example
 * // To move a task to the 'progress' category
 * moveTo('progress');
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
 * Sends a request to update the ID of a task in the database.
 *
 * This function constructs the URL for the specific task based on its number,
 * then sends a POST request to update the task's ID to the specified element.
 *
 * @async
 * @param {string} element - The new ID to assign to the task.
 * @param {Object} changeId - The object representing the task that is being updated.
 * @param {number} changeId.number - The unique number identifying the task.
 *
 * @example
 * // To change the ID of the task with number 5 to 'progress'
 * postId('progress', { number: 5 });
 */
async function postId(element, changeId) {
    let number = changeId.number;
    let path = `/task/task${number}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: element };
    await postDataId(url, idChange);
}

/**
 * Sends a PATCH request to update data for a specific task in the database.
 *
 * This function takes a URL and a data object, then sends the data to the specified URL
 * using the PATCH method to update the task's information in the database.
 *
 * @async
 * @param {string} url - The URL of the task to be updated in the database.
 * @param {Object} data - The data to be sent in the request body.
 * @param {string} data.id - The new ID or updated data for the task.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // To update the ID of a task in the database
 * postDataId('https://example.com/task/task1', { id: 'inProgress' });
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
 * Updates the checked status of a subtask checkbox in the database.
 *
 * This function retrieves the checked state of a specific checkbox, constructs the
 * corresponding URL to update the task's subtask status in the database, and then
 * sends the updated information using a PATCH request. Finally, it reloads the task data.
 *
 * @async
 * @param {number} i - The index of the main task in the array.
 * @param {number} j - The index of the subtask in the array.
 *
 * @throws {Error} Throws an error if the fetch request fails or if the parameters are invalid.
 *
 * @example
 * // To update the checked status of the first subtask of the main task at index 0
 * inputCheckBoxInfo(0, 0);
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
 *
 * This function takes a URL and a data object, converts the data object to a JSON string,
 * and sends it to the specified URL using the PATCH HTTP method. The function does not
 * return any value but will throw an error if the request fails.
 *
 * @async
 * @param {string} url - The URL endpoint for the PATCH request, typically pointing to a specific resource in the database.
 * @param {Object} data - The data to be updated in the database.
 *
 * @throws {Error} Throws an error if the fetch request fails.
 *
 * @example
 * // To update the checked status of a subtask
 * postDataCheck('/task/task1/checked', { 'task1': true });
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

function checked(subtastChecked) {
    let checkboxes = document.getElementsByName('subtask');
    for (let i = 0; i < subtastChecked.length && i < checkboxes.length; i++) {
        checkboxes[i].checked = subtastChecked[i];
    }
}

/**
 * Sets the checked state of checkbox elements based on the provided array.
 *
 * This function takes an array of boolean values and updates the state of
 * checkboxes with the name 'subtask'. Each checkbox will be set to checked
 * or unchecked according to the corresponding value in the array.
 *
 * @param {boolean[]} subtastChecked - An array of boolean values indicating
 *                                      the desired checked state for each checkbox.
 *
 * @example
 * // To set the checked state of subtasks
 * checked([true, false, true]); // First and third checkboxes will be checked, second will be unchecked.
 */
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
 *
 * This function checks the length of the input search value and determines 
 * if the search should proceed or if the task list should be reset. It also 
 * manages the visibility of a message indicating that the search returned no results.
 *
 * @param {HTMLInputElement} inputSearch - The input element containing the search value.
 * @param {Array} searchArray - An array of tasks or items to search through.
 *
 * @example
 * // To initiate a search when the user types in the search input
 * searchStart(document.getElementById('searchInput'), taskArray);
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
 *
 * This function adds the class 'drag-area-highlight' to the element with the specified ID.
 * This is commonly used to visually indicate a draggable area when an item is being dragged.
 *
 * @param {string} id - The ID of the element to be highlighted.
 *
 * @example
 * // To highlight a draggable area with the ID 'dragArea'
 * highlight('dragArea');
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * Removes the highlight from an element by removing a specific CSS class.
 *
 * This function removes the class 'drag-area-highlight' from the element with the specified ID.
 * This is commonly used to visually indicate that an item is no longer being dragged over a designated area.
 *
 * @param {string} id - The ID of the element from which the highlight should be removed.
 *
 * @example
 * // To remove the highlight from a draggable area with the ID 'dragArea'
 * removeHighlight('dragArea');
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * Adds a task to the task board after validation checks.
 *
 * This asynchronous function waits for validation before proceeding to add the task 
 * to a waiting list. It updates the UI by removing and adding a specific icon to indicate
 * the task's status.
 *
 * @param {Object} id - The object representing the task to be added.
 * @param {string} id.id - The unique identifier for the task to be added.
 *
 * @returns {Promise<void>} A promise that resolves when the task has been successfully added.
 *
 * @example
 * // To add a task with a specific ID
 * addTaskboard({ id: 'task123' });
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