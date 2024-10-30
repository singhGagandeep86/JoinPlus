let path = "";
let data = {};
let url = '';
let arrayLoad = [];
let searchArray = [];
let draggedElement;
let mediaQuery = window.matchMedia("(max-width: 1100px)");
let toggle = 0;

/** Loads initial task data and user data asynchronously.*/
async function load() {
    await loadData("/task");
    fetchUserData('/user');
}

/** Constructs a full URL for accessing the database with the provided path and authentication token.*/
function getDatabaseUrl(path) {
    let token = sessionStorage.getItem('authToken');
    return `${BASE_URL}${path}.json?auth=${token}`;
}

/** Fetches task data from the database at the specified path, initializes with empty data if none exists,*/
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

/** Opens a small popup to display task information.*/
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

/** This function filters the global array `arrayLoad` to find a task
 * matching the specified index. It returns the corresponding task*/
function createobjFromElement(i) {
    let objDataTasksmall = arrayLoad.filter(e => e['number'] == i);
    let elementfromTask = '';
    for (let i = 0; i < objDataTasksmall.length; i++) {
        elementfromTask = objDataTasksmall[i];
    }
    return elementfromTask
}

/** Closes the small task popup by adding a 'd_none' class to the popup element.*/
function closePopUpTaskSmall() {
    document.getElementById('popupTaskInfo').classList.add('d_none');
}

/** Toggles the visibility of the task switch popup.
 * It updates the arrow icon to indicate the current state of the popup.*/
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
/** This function hides the popup that allows switching task options based on the provided element ID.*/
function closePopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    select.classList.add('d_none');
}

/** Switches the task to a new status based on the provided task ID.
 * This function determines the target status of a task (e.g., 'toDo', 'progress', 'await', or 'done')*/
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

/** Changes the ID of a task and reloads the task data.
 * updates the UI by removing the arrow indicator, and reloads the task data from the server.*/
async function changeIdTaskValue(value, element) {
    let arrow = document.getElementById('arrowSwitch' + element);
    await changeIdTask(value, element);
    arrayLoad = [];
    closePopUpTaskSwitch(element);
    arrow.classList.remove('arrowTaskImg');
    await loadData("/task");
}

/** This asynchronous function sends a request to update the ID of a task identified by its element number.
 * It constructs the appropriate database URL, prepares the data for the update, and sends the update request.*/
async function changeIdTask(value, element) {
    let path = `/task/task${element}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: value };
    await postDataId(url, idChange);
}

/** This function retrieves the date from a task object, formats it from "YYYY-MM-DD" */
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

/** Adds contact information to the contact area for a given task*/
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
        }}
}

/** Adds subtask information to the subtask area for a given task.
 * This function populates the subtask area with subtasks from the provided task object.*/
function addSubtaskInfo(objDateTask) {
    let subtaskInput = document.getElementById('subtaskArea');
    let subtaskEmpty = document.getElementById('subtaskEmtpy');
    subtaskInput.innerHTML = '';
    addSubtaskInfoIf(subtaskInput, subtaskEmpty, objDateTask);
}

/** Displays subtask information if available, updating the subtask input area.*/
function addSubtaskInfoIf(subtaskInput, subtaskEmpty, objDateTask) {
    if (!objDateTask.subtask) {
        subtaskInput.innerHTML = '';
        subtaskEmpty.classList.add('d_none')
    } else if (Object.values(objDateTask.subtask).length === 0 && Object.values(objDateTask.checked) === 0) {
        subtaskInput.innerHTML = '';
    } else { let subtaskTitle = Object.values(objDateTask.subtask);
        let subtastChecked = Object.values(objDateTask.checked);
        for (let j = 0; j < subtaskTitle.length; j++) {
            let element = subtaskTitle[j];
            subtaskInput.innerHTML += templateSubtask(element, objDateTask, j);
            checked(subtastChecked);}}
}

/** This function updates the ID of a task based on the provided element, which represents
 * the target category. It also posts the updated task data and refreshes the displayed tasks.*/
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

/** This function constructs the URL for the specific task based on its number,
 * then sends a POST request to update the task's ID to the specified element.*/
async function postId(element, changeId) {
    let number = changeId.number;
    let path = `/task/task${number}`;
    let url = getDatabaseUrl(path);
    let idChange = { id: element };
    await postDataId(url, idChange);
}

/** This function takes a URL and a data object, then sends the data to the specified URL
 * using the PATCH method to update the task's information in the database.*/
async function postDataId(url, data) {
    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

/** This function retrieves the checked state of a specific checkbox, constructs the
 * corresponding URL to update the task's subtask status in the database, and then*/
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

/** Sends a PATCH request to update data in the database. 
 * This function takes a URL and a data object, converts the data object to a JSON string,*/
async function postDataCheck(url, data) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

/** Sets the checked state of checkbox elements based on the provided array.*/
function checked(subtastChecked) {
    let checkboxes = document.getElementsByName('subtask');
    for (let i = 0; i < subtastChecked.length && i < checkboxes.length; i++) {
        checkboxes[i].checked = subtastChecked[i];
    }
}

/** searche zue task from title and description */
function search() {
    let inputSearch = document.getElementById('search');
    let searchArray = arrayLoad.filter(item =>
        item['title'].toLowerCase().includes(inputSearch.value.toLowerCase()) ||
        item['description'].toLowerCase().includes(inputSearch.value.toLowerCase())
    );
    searchStart(inputSearch, searchArray);
}

/** Initiates a search based on the input value and updates the task list accordingly.
 * This function checks the length of the input search value and determines */
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

/** Highlights an element by adding a specific CSS class to it.*/
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/** Removes the highlight from an element by removing a specific CSS class.*/
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/** Adds a task to the task board after validation checks. */
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