let pathC = '';

/**
 * Loads contact data based on the provided object data.
 *
 * This function fetches contact information from the specified endpoint and 
 * processes it using the provided object data.
 *
 * @param {Object} objData - The object containing data related to the contact.
 *
 * @returns {Promise<void>} A promise that resolves when the contact data has been successfully fetched.
 *
 * @example
 * // To load contact data for a specific object
 * loadContact({ id: 'contact123' });
 */
function loadContact(objData) {
    fetchContact("/contact", objData)
}

/**
 * Fetches contact data from the specified Firebase path and loads it.
 *
 * This asynchronous function retrieves contact data from a Firebase database 
 * using the provided path and authentication token, then processes the data 
 * using the specified object data.
 *
 * @param {string} pathC - The Firebase path to fetch contact data from.
 * @param {Object} objData - The object containing data related to the contact.
 *
 * @returns {Promise<void>} A promise that resolves when the contact data has been successfully fetched and processed.
 *
 * @example
 * // To fetch contact data for a specific object
 * fetchContact("/contact", { id: 'contact123' });
 */
async function fetchContact(pathC, objData) {
    let firebaseUrl = await fetch(BASE_URL + pathC + ".json?auth=" + token);
    let firebaseUrlAsJson = await firebaseUrl.json();
    let firebaseData = Object.values(firebaseUrlAsJson);
    loadContactData(firebaseData, objData)
}

/**
 * Loads and displays contact data in the contact drop area.
 *
 * This function populates the contact drop area with checkboxes representing 
 * contacts fetched from Firebase. It checks if the contacts in the given 
 * object data are present and updates the UI accordingly. If no contacts 
 * are available, it loads an empty contact state.
 *
 * @param {Array} firebaseData - An array of contact data fetched from Firebase.
 * @param {Object} objData - An object containing information about the current task.
 *
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Load contact data for a specific task object
 * loadContactData(firebaseDataArray, { contact: { contact1: "John Doe", contact2: null } });
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
 *
 * This function populates the contact drop area with checkboxes representing 
 * contacts fetched from Firebase, even when the associated task has no contacts. 
 * It uses the provided contact data and their corresponding Firebase data 
 * (which includes color information) to create and display the contact checkboxes.
 *
 * @param {Array} contactData - An array of contact names to be displayed.
 * @param {Array} firebaseData - An array of contact data fetched from Firebase, including color information.
 *
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Load an empty contact state with specific contact data
 * loadContactEmpty(["John Doe", "Jane Smith"], [{ color: "#ff0000" }, { color: "#00ff00" }]);
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
 *
 * This function retrieves the contacts and their corresponding colors from the
 * provided task data object and displays the initials of each contact in the
 * designated area of the user interface. If there are no contacts, it hides
 * the initials area.
 *
 * @param {Object} objData - The task data object containing contact information.
 * @property {Object} objData.contact - An object representing contacts associated with the task.
 * @property {Object} objData.contactcolor - An object representing colors associated with the contacts.
 *
 * @returns {void} This function does not return a value.
 *
 * @example
 * // Load initials for a given task object
 * const taskData = {
 *     contact: { 1: "John Doe", 2: "Jane Smith" },
 *     contactcolor: { 1: "#ff0000", 2: "#00ff00" }
 * };
 * initialsLoad(taskData);
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
 *
 * This function iterates through the provided Firebase data, which is expected
 * to be an array of objects, and collects the names of each contact into a new
 * array. It is commonly used to retrieve a list of contacts from a Firebase
 * database response.
 *
 * @param {Array<Object>} firebaseData - An array of objects representing contact data from Firebase.
 * @property {string} firebaseData[].name - The name of the contact.
 *
 * @returns {Array<string>} An array containing the names of the contacts.
 *
 * @example
 * // Extract contact names from Firebase data
 * const firebaseResponse = [
 *     { name: "John Doe" },
 *     { name: "Jane Smith" },
 *     { name: "Alice Johnson" }
 * ];
 * const contacts = contactArray(firebaseResponse);
 * console.log(contacts); // Output: ["John Doe", "Jane Smith", "Alice Johnson"]
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
 *
 * This function retrieves the task data associated with the given index,
 * updates the popup with the task information, and initializes the edit fields.
 * It also adds an event listener to prevent clicks from closing the popup when
 * clicking on the designated close area.
 *
 * @param {number} i - The index or identifier of the task to be edited.
 *
 * @returns {void}
 *
 * @example
 * // Open the edit popup for the task with index 2
 * editOpen(2);
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
 *
 * This function retrieves today's date, formats it to the ISO standard
 * (YYYY-MM-DD), and sets this value as the minimum date that can be selected
 * in the date input field with the ID 'dateEditEnter'.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to initialize the minimum date for the date input
 * dateVali();
 */
function dateVali() {
    let today = new Date().toISOString().split('T')[0];
    document.getElementById('dateEditEnter').setAttribute('min', today);
}

/**
 * Loads the necessary data for editing a task and initializes the UI components.
 *
 * This function takes in an object containing task data (`objData`) and a
 * priority check value (`prioCheck`). It performs various actions to populate
 * the edit UI, including loading contacts, task description, subtasks,
 * priority settings, initials, and the date validation.
 *
 * @param {Object} objData - The object containing the task data to be edited.
 * @param {string} prioCheck - The current priority setting of the task.
 * 
 * @returns {void}
 *
 * @example
 * // Assuming objData contains the relevant task information and prioCheck is the task's priority.
 * loadEditData(objData, prioCheck);
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
 *
 * This function opens or closes the contact dropdown menu when triggered by an event,
 * such as a button click. It also initializes the selected contacts and sets up event
 * listeners for closing the dropdown when clicking outside of it.
 *
 * @param {Event} event - The event object representing the click event that triggered the function.
 * 
 * @returns {void}
 *
 * @example
 * // Assuming this function is called when a button is clicked to open the contact dropdown.
 * contactDropOpen(event);
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
 *
 * This function is triggered by a click event on the document. It checks if the click
 * occurred outside the contact dropdown area. If so, it hides the dropdown and resets
 * the rotation of the associated arrow icon.
 *
 * @param {Event} event - The event object representing the click event that triggered the function.
 * 
 * @returns {void}
 *
 * @example
 * // This function is usually registered as an event listener to handle clicks outside the dropdown.
 * document.addEventListener('click', closeDropDownContact);
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
 *
 * This function retrieves subtasks from the provided `objData` and populates
 * the HTML element with the ID 'subTaskBoard' with the corresponding subtask
 * HTML markup.
 *
 * @param {Object} objData - The object containing task data, which may include subtasks.
 * @param {Object} objData.subtask - An optional object containing the subtasks of the task.
 *
 * @returns {void}
 *
 * @example
 * // Assuming objData is an object with subtasks.
 * loadSubs(objData);
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
 *
 * This function retrieves the description from the given task data object and
 * populates the textarea with the class 'textAreaData' with that description.
 *
 * @param {Object} objData - The object containing task data.
 * @param {string} objData.description - The description of the task to be set in the textarea.
 *
 * @returns {void}
 *
 * @example
 * // Assuming objData is an object with a description property.
 * descriptionData(objData);
 */
function descriptionData(objData) {
    document.querySelector('.textAreaData').value = objData.description;
}

/**
 * Sets the checked state of the priority radio buttons based on the provided priority value.
 *
 * This function iterates through all radio buttons with the name 'priority' and checks
 * the button that matches the provided priority value.
 *
 * @param {string} prioCheck - The priority value to match against the radio buttons.
 * 
 * @returns {void}
 *
 * @example
 * // Assuming the user wants to set the priority to 'high'.
 * priorityEditCheck('high');
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
 *
 * This function searches through all checkboxes with the class 
 * 'checkboxDesignContact'. For each checked checkbox, it retrieves the associated 
 * contact name and color and stores them in an array of objects.
 *
 * @returns {Array<{ name: string, color: string }>} An array of objects representing the selected contacts,
 *          where each object contains the contact's name and color.
 *
 * @example
 * // Assuming some checkboxes are checked in the contact dropdown,
 * // this will return an array of selected contacts with their names and colors.
 * let selectedContacts = getSelectedContacts();
 * console.log(selectedContacts);
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
 *
 * This function retrieves the currently selected contacts using the 
 * `getSelectedContacts` function and updates the inner HTML of the 
 * element with the ID 'initialsArea' to display their initials.
 * It also removes the 'd_none' class to make the initials area visible 
 * if there are selected contacts.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to update the initials area with selected contacts.
 * intiCheckContact();
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
 * Deletes a task from the database based on the provided element identifier.
 *
 * This function constructs a URL using the provided element identifier,
 * sends a DELETE request to remove the task, and then refreshes the
 * task list by calling `loadData`. It also closes any open pop-up
 * related to the task being deleted.
 *
 * @async
 * @param {number|string} element - The identifier of the task to be deleted.
 *
 * @returns {Promise<void>} A promise that resolves when the delete operation is complete.
 *
 * @example
 * // Delete a task with the identifier 5.
 * await deleteData(5);
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

/**
 * Creates an empty task node in the database at the specified path.
 *
 * This function sends a PUT request to the specified path in the database
 * with an empty string as the body, effectively creating an empty task node.
 *
 * @async
 * @param {string} path - The path in the database where the empty task node will be created.
 *
 * @returns {Promise<void>} A promise that resolves when the empty task node creation is complete.
 *
 * @example
 * // Create an empty task node at the path "/task/newTask".
 * await createEmptyTaskNode("/task/newTask");
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
 * Initializes the subtask input area by clearing its current content
 * and populating it with the starting subtask template.
 *
 * This function retrieves the subtask input element from the DOM,
 * clears any existing HTML content, and then sets it with the
 * initial subtask template provided by the `subtaskstart` function.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to reset the subtask input area.
 * substartDiv();
 */
function substartDiv() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskstart();
}

/**
 * Clears the current content of the subtask input area and populates it
 * with a new subtask template.
 *
 * This function retrieves the subtask input element from the DOM,
 * clears any existing HTML content, and then sets it with the
 * template for adding a new subtask provided by the `subtaskAdd` function.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to reset the subtask input area and display the subtask template.
 * subtastAdd();
 */
function subtastAdd() {
    let startSubInput = document.getElementById('subtaskInput');
    startSubInput.innerHTML = '';
    startSubInput.innerHTML = subtaskAdd();
}

/**
 * Resets the subtask input area by invoking the substartDiv function.
 *
 * This function is intended to clear the existing input for subtasks
 * and initialize the subtask input area with the default template.
 * It effectively prepares the input area for new subtasks.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to reset the subtask input area.
 * deletInput();
 */
function deletInput() {
    substartDiv();
}

/**
 * Adds a new subtask based on the value entered in the subtask input field.
 *
 * This function retrieves the value from the input field with the ID 'subInput',
 * trims any leading or trailing whitespace, and checks if the input is not empty.
 * If the input is valid, it calls the `loadSubtaskLi` function to display the new subtask
 * and resets the input field by invoking the `substartDiv` function.
 *
 * @returns {void}
 *
 * @example
 * // Call this function to add a new subtask from the input field.
 * addInputSubtastk();
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
 *
 * This function takes a subtask value as input and appends it to the 
 * subtask area identified by the ID 'subTaskBoard'. The subtask is added
 * using the `addSubTask` function, which should return the HTML representation
 * of the subtask.
 *
 * @param {string} inputValue - The value of the subtask to be added.
 * @returns {void}
 *
 * @example
 * // Add a new subtask to the task board.
 * loadSubtaskLi('Finish the report');
 */
function loadSubtaskLi(inputValue) {
    let subtaskArea = document.getElementById('subTaskBoard');
    subtaskArea.innerHTML += addSubTask(inputValue);
}

/**
 * Edits a subtask by replacing its current content with an editable template.
 *
 * This function takes a list item element representing a subtask and updates
 * its inner HTML to allow editing. It retrieves the current text of the subtask,
 * trims it, and removes the first two characters (assumed to be a prefix).
 * The editable template is generated by the `templateSub1` function.
 *
 * @param {HTMLElement} liElement - The list item element representing the subtask.
 * @returns {void}
 *
 * @example
 * // Assuming `li` is a reference to a subtask list item element.
 * editSubTask(li);
 */
function editSubTask(liElement) {
    let currentText = liElement.querySelector('.taskText').textContent.trim().substring(2);
    liElement.innerHTML = templateSub1(currentText);
}

/**
 * Deletes a task from the list when the delete event is triggered.
 *
 * This function listens for a delete event on a task element. It stops
 * the event from propagating further up the DOM and then removes the
 * closest list item (`<li>`) element from the DOM. This effectively
 * deletes the task from the displayed list.
 *
 * @param {MouseEvent} event - The event object representing the delete action.
 * @returns {void}
 *
 * @example
 * // Assuming this function is called in response to a delete button click
 * deleteTask(event);
 */
function deleteTask(event) {
    event.stopPropagation();
    let liElement = event.target.closest('li');
    liElement.remove();
}

/**
 * Saves the updated value of a subtask when triggered by an event.
 *
 * This function listens for an event (like a button click) to save the changes
 * made to a subtask. It retrieves the new value from an input field within the
 * closest list item (`<li>`). If the input field is present and the new value
 * is not empty, it updates the list item's inner HTML to reflect the new value.
 *
 * @param {MouseEvent} event - The event object representing the action to save the task.
 * @param {HTMLElement} checkElement - The element that triggered the save action, typically a button.
 * @returns {void}
 *
 * @example
 * // This function is typically called on a click event of a save button.
 * saveTask(event, this);
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
 *
 * This function allows a user to enter and save edits to a subtask. It checks
 * if the current subtask list item is in editing mode. If it is, it saves the
 * updated value from the input field back to the list item. If it is not in
 * editing mode, it changes the list item's content to an input field for editing.
 *
 * @param {MouseEvent} event - The event object representing the action to toggle editing.
 * @param {HTMLElement} checkElement - The element that triggered the toggle action, typically a button.
 * @returns {void}
 *
 * @example
 * // This function is typically called on a click event of an edit button.
 * toggleEditTask(event, this);
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
 *
 * This function selects all subtask elements in the subtask board, extracts
 * the text content of each subtask, and returns an array of these values.
 * It trims leading whitespace and removes any leading bullet points or numbers.
 *
 * @returns {string[]} An array containing the text values of all subtasks.
 *
 * @example
 * // Retrieve all subtasks and log them to the console.
 * let allSubTasks = getAllSubTasks();
 * console.log(allSubTasks);
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
 *
 * This function selects all radio button inputs with the name "priority",
 * checks which one is checked, and returns its value. If no radio button 
 * is selected, it returns `undefined`.
 *
 * @returns {string|undefined} The value of the selected priority radio button,
 *                             or undefined if none is selected.
 *
 * @example
 * // Get the selected priority and log it to the console.
 * let selectedPriority = readPrio();
 * console.log(selectedPriority);
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
 *
 * This function gathers information such as title, description, due date,
 * priority, selected contacts, and subtasks from the form inputs and
 * organizes them into structured objects for further processing. It then
 * validates the collected data.
 *
 * @param {number} number - The identifier for the task being edited.
 * 
 * @returns {void}
 *
 * @example
 * // Read and validate the data for task with ID 1.
 * readEditData(1);
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
 *
 * This function checks if the title is empty. If it is, it calls the
 * `failNameEditBoard` function to handle the failure case. If the title
 * is valid (not empty), it proceeds to push the edited task data
 * using the `pushDataEdit` function.
 *
 * @param {string} title - The title of the task to be edited.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {Object} subtaskobj - An object containing subtasks.
 * @param {Array} checked - An array representing the checked state of subtasks.
 * @param {Array} contactName - An array of selected contact names.
 * @param {Array} color - An array of colors associated with the contacts.
 * @param {number} numberEditElement - The identifier for the task being edited.
 * @param {string} priority - The priority level of the task.
 *
 * @returns {boolean} - Returns `false` if the title is empty; otherwise, proceeds to push data.
 *
 * @example
 * // Validate and push the edited data for a task.
 * const isValid = nameValiEdit('New Task Title', 'Task Description', '2024-12-31', subtaskObj, checkedArray, contactNames, colors, 1, 'high');
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
 *
 * This function checks if the title input is not empty. If the title is valid (not empty),
 * it hides the failure message by adding the 'd_none' class to the element with the ID 
 * 'failTitleEditBoard' and removes the 'titleInputFail' class from the element 
 * with the ID 'titleEditFail'.
 *
 * @returns {void}
 *
 * @example
 * // Clear failure messages if the title input is valid.
 * clearFailAdd();
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
 * This function displays an error message field and highlights the input field.
 *
 * @function
 * @returns {void}
 */
function failNameEditBoard() {
    document.getElementById('titleEditFail').classList.add('titleInputFail');
    document.getElementById('failTitleEditBoard').classList.remove('d_none');
}

/**
 * Converts an array of subtasks into an object with numbered keys.
 *
 * @param {Array<string>} subtask - An array of subtasks.
 * @returns {Object} An object where each key is in the format 'taskX', 
 *                  and each value is the corresponding subtask text.
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
 *
 * @param {Array<string>} subtask - An array of subtasks.
 * @returns {Object} An object where each key is in the format 'taskX', 
 *                  and each value is set to false, indicating the task is unchecked.
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
 *
 * @param {Array<Object>} contact - An array of contact objects, each containing a 'name' property.
 * @returns {Object} An object where each key is in the format 'contactX',
 *                  and each value is the corresponding contact's name.
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
 *
 * @param {Array<Object>} contact - An array of contact objects, each containing a 'color' property.
 * @returns {Object} An object where each key is in the format 'colorX',
 *                  and each value is the corresponding contact's color.
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
 * Sends edited task data to the server.
 *
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {Object} subtaskobj - An object representing subtasks associated with the task.
 * @param {Object} checked - An object indicating the checked status of each subtask.
 * @param {string} contactName - The name of the contact associated with the task.
 * @param {string} color - The color associated with the contact.
 * @param {number} numberEditElement - The identifier for the task being edited.
 * @param {string} priority - The priority level of the task.
 * @returns {void}
 */
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

/**
 * Sends a PATCH request to update data at the specified path.
 *
 * @async
 * @param {string} [path=""] - The path in the database to send the request to.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<void>} A promise that resolves when the request is complete.
 */
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

/**
 * Loads new task data and refreshes the display.
 *
 * This function resets the array for loaded tasks, calls the load function to fetch new data,
 * and closes any active pop-up for task editing.
 *
 * @returns {void}
 */
function loadnewTaskEdit() {
    arrayLoad = [];
    load();
    closePopUpTaskSmall();
}