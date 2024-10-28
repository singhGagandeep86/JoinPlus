let token = sessionStorage.getItem('authToken');
let names = [];
let namesInitials = [];
let colours = [];
let array = [];
let expanded = false;
let dropdownOpen = false;
let task = {};

/**
 * Initializes data fetching and loads necessary information.
 *
 * Calls `fetchUrl` to retrieve a URL and `fetchUserData` to load user information
 * from a specific API endpoint (`/user`).
 *
 * @async
 * @function init
 * @returns {Promise<void>} A promise that resolves when all data has been loaded.
 */
async function init() {
  fetchUrl();
  fetchUserData('/user');
}

/**
 * Constructs a full URL for accessing a database resource.
 *
 * Combines the base URL with the provided path and attaches an authentication token.
 *
 * @function getDatabaseUrl
 * @param {string} path - The specific path to the database resource.
 * @returns {string} The complete URL for accessing the database resource.
 */
function getDatabaseUrl(path) {
  return `${BASE_URL}${path}.json?auth=${token}`;
}

/**
 * Fetches data from Firebase and initializes contact data processing.
 *
 * Retrieves data from Firebase by constructing a URL with authentication, 
 * then parses the response and sends the first item to `contactsData`.
 *
 * @async
 * @function fetchUrl
 * @returns {Promise<void>} A promise that resolves when the data is successfully fetched and processed.
 */
async function fetchUrl() {
  let firebaseUrl = await fetch(BASE_URL + ".json?auth=" + token);
  let firebaseUrlAsJson = await firebaseUrl.json();
  let firebaseData = Object.values(firebaseUrlAsJson);
  contactsData(firebaseData[0]);
}

/**
 * Processes contact data from Firebase.
 *
 * Iterates through the provided contact data to extract names and pass each contact to either
 * `wthScndName` or `wthoutScndName`, based on whether they have one or two name parts.
 *
 * @function contactsData
 * @param {Object} firebase - The Firebase data object containing contacts.
 */
function contactsData(firebase) {
  let contactsLength = Object.values(firebase);
  let objLngth = contactsLength.length;
  for (let i = 0; i < objLngth; i++) {
    const eachName = contactsLength[i].name;
    array.push(contactsLength[i]);
    if (array[i].name.split(' ')[1]) {
      wthScndName(i, eachName);
    }
    else { wthoutScndName(i, eachName); }
  }
}

/**
 * Renders contacts with a first and last name.
 *
 * Extracts the color, sanitized name, and initials for each contact, 
 * and appends them to the contacts list with both first and last initials.
 *
 * @function wthScndName
 * @param {number} i - Index of the contact in the array.
 * @param {string} eachName - The full name of the contact.
 */
function wthScndName(i, eachName) {
  let colour = array[i].color;
  let sanitizedEachName = eachName.replace(/\s+/g, '_');
  let firstName = array[i].name.split(' ')[0].toUpperCase();
  let contact = document.getElementById("allCntcts");
  let lastName = array[i].name.split(' ')[1].toUpperCase();
  let firstNameStart = firstName[0];
  let lastNameStart = lastName[0];
  contact.innerHTML += contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart);
}

/**
 * Renders contacts with only a single name part.
 *
 * Extracts the color, sanitized name, and first initial for each contact,
 * appending them to the contacts list with only the first initial.
 *
 * @function wthoutScndName
 * @param {number} i - Index of the contact in the array.
 * @param {string} eachName - The full name of the contact.
 */
function wthoutScndName(i, eachName) {
  let colour = array[i].color;
  let sanitizedEachName = eachName.replace(/\s+/g, '_');
  let firstName = array[i].name.split(' ')[0].toUpperCase();
  let contact = document.getElementById("allCntcts");
  let firstNameStart = firstName[0];
  let lastNameStart = '';
  contact.innerHTML += contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart);
}

/**
 * Adds selected contacts to a separate display area.
 *
 * Updates the `selCntcts` container with selected contact initials and colors.
 *
 * @function selectionContact
 * @param {string} name - The name of the selected contact.
 * @param {string} colour - The color associated with the selected contact.
 */
function selectionContact(name, colour) {
  const currenID = document.getElementById(name);
  ifelseLogics(currenID, name, colour);
  let SelectedContactsBoard = document.getElementById('selCntcts');
  SelectedContactsBoard.innerHTML = '';
  for (let i = 0; i < namesInitials.length; i++) {
    const namesInitial = namesInitials[i];
    const color = colours[i];
    SelectedContactsBoard.innerHTML += `<div class="namesInitials b-${color}">${namesInitial}</div>`;
  }
}

/**
 * Manages the display of the selection div for contacts.
 *
 * Shows up to four selected contacts in the UI and displays a "more" button if additional contacts are selected.
 *
 * @function ifelseLogics
 * @param {HTMLElement} currenID - The current checkbox element for the contact.
 * @param {string} name - The name of the contact.
 * @param {string} colour - The color associated with the contact.
 */
function ifelseLogics(currenID, name, colour) {
  if (currenID.checked == true) {
    pushSelection(currenID, name, colour);
  }
  else {
    spliceSelection(currenID, name);
  }
  if (namesInitials.length > 4) {
    document.getElementById('moreIcon').classList.remove("d_noneImg");
  } else {
    document.getElementById('moreIcon').classList.add("d_noneImg");
  }
}

/**
 * Adds a contact to the selection list and updates its UI representation.
 *
 * Sets styling for the selected contact and updates arrays based on name structure (single or two-part names).
 *
 * @function pushSelection
 * @param {HTMLElement} currenID - The current checkbox element for the contact.
 * @param {string} name - The name of the contact.
 * @param {string} colour - The color associated with the contact.
 */
function pushSelection(currenID, name, colour) {
  currenID.parentElement.style.backgroundColor = "#2A3647";
  currenID.parentElement.style.color = "white";
  currenID.nextElementSibling.style.content = "url(../img/checkButtonSelected.svg)";
  names.push(name);
  const nameArray = name.split('_');
  const firstName = nameArray[0].toUpperCase();
  if (nameArray[1]) {
    clrWthTwoNames(nameArray, firstName, colour);
  }
  else {
    clrWthOneName(firstName, colour);
  }
}

/**
 * Adds contacts with two-part names to initials and colors arrays.
 *
 * Extracts initials from a two-part name and pushes them, along with the color, to the relevant arrays.
 *
 * @function clrWthTwoNames
 * @param {string[]} nameArray - Array of name parts.
 * @param {string} firstName - The first name in uppercase.
 * @param {string} colour - The color associated with the contact.
 */
function clrWthTwoNames(nameArray, firstName, colour) {
  const lastName = nameArray[1].toUpperCase();
  let firstNameStart = firstName[0];
  let lastNameStart = lastName[0];
  namesInitials.push(firstNameStart + lastNameStart);
  colours.push(colour);
}


/**
 * Adds contacts with single-part names to initials and colors arrays.
 *
 * Extracts the first initial and pushes it, along with the color, to the relevant arrays.
 *
 * @function clrWthOneName
 * @param {string} firstName - The first name in uppercase.
 * @param {string} colour - The color associated with the contact.
 */
function clrWthOneName(firstName, colour) {
  let firstNameStart = firstName[0];
  let lastNameStart = '';
  namesInitials.push(firstNameStart + lastNameStart);
  colours.push(colour);
}

/**
 * Removes a contact from the selection list and updates its UI representation.
 *
 * Resets styling for the deselected contact and removes the contact from selection arrays.
 *
 * @function spliceSelection
 * @param {HTMLElement} currenID - The current checkbox element for the contact.
 * @param {string} name - The name of the contact.
 */
function spliceSelection(currenID, name) {
  currenID.parentElement.style.backgroundColor = "transparent";
  currenID.parentElement.style.color = "black";
  currenID.nextElementSibling.style.content = "url(../img/CheckbuttonEmpty.png)";
  const currentName = names.indexOf(name);
  names.splice(currentName, 1);
  namesInitials.splice(currentName, 1);
  colours.splice(currentName, 1);
}

/**
 * Renders the subtask input field if it doesn't exist.
 *
 * Initializes the subtask input field by inserting its template into the DOM.
 *
 * @function renderSubTask
 */
function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = subTaskTemp();
    document.getElementById('inputField').style.backgroundImage = 'none';
  }
}

/**
 * Clears the subtask input field.
 *
 * Resets the subtask input field's value and updates the inner HTML.
 *
 * @function resetInput
 */
function resetInput() {
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

/**
 * Adds a new subtask to the subtask board.
 *
 * Appends a new subtask item to the subtask board if the input field has a value, then clears the input field.
 *
 * @function addList
 */
function addList() {
  let subTaskInput = document.getElementById('inputField').value;
  let subTaskBoard = document.getElementById('subTsksBoard');
  if (subTaskInput) {
    subTaskBoard.innerHTML += generatedList(subTaskInput);
  }
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

/**
 * Applies a hover effect to a subtask icon.
 *
 * Shows the subtask action buttons when the icon is hovered over.
 *
 * @function hoverEffect
 * @param {HTMLElement} element - The element containing the subtask icon.
 */
function hoverEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.remove('subTaskIcon');
}

/**
 * Removes the hover effect from a subtask icon.
 *
 * Hides the subtask action buttons when the icon is no longer hovered over.
 *
 * @function normalEffect
 * @param {HTMLElement} element - The element containing the subtask icon.
 */
function normalEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.add('subTaskIcon');
}

/**
 * Enables editing mode for a subtask.
 *
 * Replaces the subtask display with an editable input field containing the current value.
 *
 * @function editsubTask
 * @param {HTMLElement} element - The element representing the edit action for the subtask.
 */
function editsubTask(element) {
  let parent = element.closest('li');
  let currentValue = parent.querySelector('.leftPart').innerText.trim();
  parent.innerHTML = editTempelate(currentValue);
}

/**
 * Deletes a subtask from the list.
 *
 * Removes the subtask item from the DOM.
 *
 * @function delsubTask
 * @param {HTMLElement} element - The element representing the delete action for the subtask.
 */
function delsubTask(element) {
  element.closest('li').remove();
}

/**
 * Saves a new or edited subtask to the list.
 *
 * Replaces the editable input field with the updated subtask display.
 *
 * @function newSubTask
 * @param {HTMLElement} element - The element representing the save action for the subtask.
 */
function newSubTask(element) {
  let parent = element.closest('li');
  let newValue = parent.querySelector('.subTaskInput').value;
  parent.innerHTML = newSubTemp(newValue);
}

/**
 * Toggles the display of the contacts dropdown and rotates the arrow icon.
 * If the dropdown is not expanded, it will display it; otherwise, it hides it.
 */
function showCheckBoxes() {
  const allCntcts = document.getElementById("allCntcts");
  if (!expanded) {
    document.getElementById('arrow').style.transform = "rotate(-180deg)";
    allCntcts.style.display = "block";
    expanded = true;
  } else {
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    allCntcts.style.display = "none";
    expanded = false;
  }
}

/**
 * Event listener to close the contacts dropdown when clicking outside of it.
 * Checks if the click target is not within the dropdown or its triggering element.
 * 
 * @param {MouseEvent} event - The click event to check.
 */
document.addEventListener('click', function (event) {
  const assign = document.getElementById("assign");
  const allCntcts = document.getElementById("allCntcts");
  if (expanded && !assign.contains(event.target) && !allCntcts.contains(event.target)) {
    allCntcts.style.display = "none";
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    expanded = false;
    document.getElementById("allCntcts").addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
});

/**
 * Toggles the visibility of the task category dropdown.
 * Shows the dropdown if it is currently hidden; hides it otherwise.
 */
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown');
  if (!dropdownOpen) {
    dropdown.classList.remove('selectHide');
    clearFailAddCat();
    dropdownOpen = true;
  } else {
    dropdown.classList.add('selectHide');
    dropdownOpen = false;
  }
}

/**
 * Selects an option from the dropdown and updates the displayed value.
 * 
 * @param {HTMLElement} element - The selected dropdown option element.
 */
function selectOption(element) {
  const customSelect = document.getElementById('customSelect');
  const hiddenSelect = document.getElementById('hiddenSelect');
  customSelect.textContent = element.textContent;
  hiddenSelect.value = element.getAttribute('data-value');
  toggleDropdown();
  customSelect.classList.remove('invalid');
}

/**
 * Event listener to close the task category dropdown when clicking outside of it.
 * 
 * @param {MouseEvent} rightEvent - The click event to check.
 */
document.addEventListener('click', function (rightEvent) {
  const assignHeading = document.getElementById('customSelect');
  if (dropdownOpen && !assignHeading.contains(rightEvent.target)) {
    toggleDropdown();
  }
});

/**
 * Resets the form and its associated variables when the reset button is clicked.
 */
function resetAll() {
  deletArray()
  resetingGlobalVariable();
  resetingLocalVariables();
  resetError();
  let allContacts = document.getElementById('allCntcts');
  let allLabels = allContacts.getElementsByTagName('label');
  for (i = 0; i < allLabels.length; i++) {
    let label = allLabels[i];
    let chkBox = label.querySelector('span');
    label.style.backgroundColor = "transparent";
    label.style.color = "black";
    chkBox.style.content = "url(../img/CheckbuttonEmpty.png)";
  }
}

/**
 * Clears all arrays used for storing task-related data.
 */
function deletArray() {
  names = [];
  namesInitials = [];
  colours = [];
  array = [];
}

/**
 * Initializes the form submission handling on DOM content load.
 * Prevents the default form submission to handle it with custom logic.
 */
document.addEventListener('DOMContentLoaded', function () {
  let form = document.getElementById('myForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addingTask('toDo');
    });
  }
});

/**
 * Adds a new task if validation passes, then navigates to the task board.
 * 
 * @param {string} id - The ID of the task to be added.
 */
async function addingTask(id) {
  if (checkValidation()) {
    document.getElementById('taskDoneIcon').classList.remove("subTaskIcon");
    await toWaiting(id);
    await navigateToBoard();
  }
}

/**
 * Moves the task to the waiting state, collects task details,
 * and pushes data to Firebase.
 * 
 * @param {string} id - The ID of the task being processed.
 * @returns {Promise<void>} - A promise that resolves after a delay.
 */
async function toWaiting(id) {
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
  pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id);
  return new Promise(resolve => setTimeout(resolve, 1700));
}

/**
 * Navigates the user to the task board page.
 */
async function navigateToBoard() {
  window.location.href = 'board.html';
}

/**
 * Generates a string representing the color associated with the task category.
 * 
 * @returns {string} - The first four characters of the category name.
 */
function categoryColourGen() {
  let category = document.getElementById('customSelect').innerText;
  return category.slice(0, 4);
}

/**
 * Generates a string representing the color associated with the task category.
 * 
 * @returns {string} - The first four characters of the category name.
 */
async function postTask(path = "", data = {}) {
  await fetch(getDatabaseUrl(path), {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
}

/**
 * Pushes task data to Firebase.
 */
function pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id) {
  postTask(`/task/task${newTaskNumber}`, {
    'category': category,
    'color': categoryColourGen(),
    'contact': name,
    'contactcolor': color,
    'date': actDate,
    'description': desText,
    'id': id,
    'number': newTaskNumber,
    'prio': priority,
    'subtask': subtask,
    'title': titleText,
    'checked': checked
  });
}

/**
 * Creates a subtask object from the list of subtasks.
 * 
 * @param {HTMLCollection} list - The list of subtasks to process.
 * @returns {Object} - An object containing subtasks indexed by task number.
 */
function subtastCreate(list) {
  let subtask = {};
  for (let i = 0; i < list.length; i++) {
    let eachList = list[i];
    let listText = eachList.innerText;
    subtask[`task${i + 1}`] = listText;
  }
  return subtask
}

/**
 * Creates a checked state object for each subtask.
 * 
 * @param {HTMLCollection} list - The list of subtasks.
 * @returns {Object} - An object indicating the checked state for each subtask.
 */
function checkedCreate(list) {
  let checked = {};
  for (let i = 0; i < list.length; i++) {
    checked[`task${i + 1}`] = false;
  }

  return checked;
}

/**
 * Creates a contact object from the names array.
 * 
 * @returns {Object} - An object mapping contacts to their names.
 */
function createContactFire() {
  let contacts = {};
  for (let j = 0; j < names.length; j++) {
    let name = names[j];
    let sanitizedName = name.replace(/_/g, ' ');
    contacts[`contact${j + 1}`] = sanitizedName;
  }
  return contacts;
}

/**
 * Generates a color object from the colours array.
 * 
 * @returns {Object} - An object mapping colors to their identifiers.
 */
function colorFirebase() {
  let coloursAsObject = {};
  for (let k = 0; k < colours.length; k++) {
    let colour = colours[k];
    coloursAsObject[`color${k + 1}`] = colour;
  }
  return coloursAsObject;
}

/**
 * Generates a random 6-digit number.
 * 
 * @returns {string} - A string representing a 6-digit random number.
 */
function generateRandomNumber() {
  let number = '';
  for (let i = 0; i < 6; i++) {
    let digit;
    do {
      digit = Math.floor(Math.random() * 10);
    } while (digit === 0);
    number += digit;
  }
  return number;
}

/**
 * Validates the task inputs and ensures they meet the required criteria.
 * 
 * @returns {boolean} - True if all validations pass; otherwise, false.
 */
function checkValidation() {
  let task = document.getElementById('titleText').value.trim();
  let category = document.getElementById('customSelect').innerText;
  let taskReg = /^[a-zA-Z]+( [a-zA-Z&]+)*$/;
  let dateReg = dateCheck();
  let chkAllFnc = checkAll(task, dateReg, category);
  let chkTskFnc = checkTask(taskReg, task);
  let chkDteFnc = checkDate(dateReg);
  let chkCatFnc = checkCategory(category);
  if (chkAllFnc == false || chkTskFnc == false || chkDteFnc == false || chkCatFnc == false) {
    return false;
  }

  return true;
}

/**
 * Checks all validation criteria for task input.
 * 
 * @param {string} task - The task title.
 * @param {boolean} dateReg - The result of the date validation.
 * @param {string} category - The selected task category.
 * @returns {boolean} - False if validation fails, otherwise true.
 */
function checkAll(task, dateReg, category) {
  if (!task && dateReg == false && category === `Select task category`) {
    failAll();
    return false;
  }
}

/**
 * Validates the task title against the defined regular expression.
 * 
 * @param {RegExp} taskReg - The regular expression to validate the task title.
 * @param {string} task - The task title to validate.
 * @returns {boolean} - False if validation fails, otherwise true.
 */
function checkTask(taskReg, task) {
  if (!taskReg.test(task)) {
    failTask();
    return false;
  }
}

/**
 * Validates the provided date and updates the UI to show or hide error messages.
 *
 * @param {boolean} dateReg - Result of the date validation check; should be `true` for valid dates and `false` for invalid dates.
 * @returns {boolean} - Returns `true` if the date is valid, `false` otherwise.
 *
 * If `dateReg` is `false`, this function:
 * - Calls `failDate()` to display the date error message.
 * - Returns `false` to indicate an invalid date.
 * 
 * If `dateReg` is `true`, this function:
 * - Hides any date-related error messages.
 * - Removes error styling from the date input field.
 * - Returns `true` to indicate a valid date.
 */
function checkDate(dateReg) {
  if (dateReg == false) {
    failDate();
    return false;
  }
  else {
    document.getElementById('failDueDate').classList.add("selectHide");
    document.getElementById('dateData').classList.remove("failedinput");
    return true;
  }
}

/**
 * Validates the selected task category.
 * 
 * @param {string} category - The selected task category.
 * @returns {boolean} - False if validation fails, otherwise true.
 */
function checkCategory(category) {
  if (category === `Select task category`) {
    failCategory();
    return false;
  }
}

/**
 * Checks the validity of the entered date against the current date.
 * 
 * @returns {boolean} - True if the entered date is valid; otherwise, false.
 */
function dateCheck() {
  let catchedDate = new Date();
  let year = catchedDate.getFullYear();
  let month = catchedDate.getMonth() + 1;
  let day = catchedDate.getDate();
  let enteredDate = document.getElementById('dateData').value;
  let splittedDate = enteredDate.split("-");
  let inputYear = splittedDate[0];
  let inputMonth = splittedDate[1];
  let inputDate = splittedDate[2];
  if (enteredDate) {
    return compareDate(year, month, day, inputYear, inputMonth, inputDate);
  }
  else {
    return false;
  }
}

/**
 * Compares the entered date with the current date.
 * 
 * @param {number} year - The current year.
 * @param {number} month - The current month.
 * @param {number} day - The current day.
 * @param {number} inputYear - The entered year.
 * @param {number} inputMonth - The entered month.
 * @param {number} inputDate - The entered date.
 * @returns {boolean} - True if the entered date is valid; otherwise, false.
 */
function compareDate(year, month, day, inputYear, inputMonth, inputDate) {
  if (inputYear > year && inputYear < 10000) {
    return true;
  }
  else {
    if (inputYear == year & inputMonth > month) {
      return true;
    }
    else {
      if (inputYear == year & inputMonth == month & inputDate >= day) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}

/**
 * Displays an error message for invalid task input.
 */
function failTask() {
  document.getElementById('failName').classList.remove("selectHide");
  document.getElementById('titleText').classList.add("failedinput");
}

/**
 * Displays an error message for invalid date input.
 */
function failDate() {
  document.getElementById('failDueDate').classList.remove("selectHide");
  document.getElementById('dateData').classList.add("failedinput");
}

/**
 * Displays an error message for invalid category selection.
 */
function failCategory() {
  document.getElementById('failCategory').classList.remove("selectHide");
  document.getElementById('customSelect').classList.add("failedinput");
}

/**
 * Displays error messages for all invalid inputs.
 */
function failAll() {
  document.getElementById('failName').classList.remove("selectHide");
  document.getElementById('failDueDate').classList.remove("selectHide");
  document.getElementById('failCategory').classList.remove("selectHide");
  document.getElementById('titleText').classList.add("failedinput");
  document.getElementById('dateData').classList.add("failedinput");
  document.getElementById('customSelect').classList.add("failedinput");
}

/**
 * Clears error messages for the specified input and associated error element.
 * 
 * @param {string} inputId - The ID of the input element.
 * @param {string} errorId - The ID of the error element to hide.
 */
function clearFailAddTask(inputId, errorId) {
  let inputValue = document.getElementById(inputId).value.trim();
  if (inputValue !== '') {
    document.getElementById(errorId).classList.add('selectHide');
    document.getElementById(inputId).classList.remove('failedinput');
  }
}

/**
 * Clears the error message for the task category selection.
 */
function clearFailAddCat() {
  document.getElementById('failCategory').classList.add('selectHide');
  document.getElementById('customSelect').classList.remove('failedinput');
}

/**
 * Scrolls the contact selection area to the right.
 */
function scrollOn() {
  let scrollDiv = document.getElementById('selCntcts');
  scrollDiv.scrollLeft = scrollDiv.scrollWidth;
}

/**
 * Resets global variables related to contacts and their states.
 */
function resetingGlobalVariable() {
  expanded = false;
  names = [];
  namesInitials = [];
}

/**
 * Resets local variables and UI elements to their initial states.
 */
function resetingLocalVariables() {
  document.getElementById('customSelect').innerHTML = `Select task category`;
  document.getElementById('allCntcts').style.display = "none";
  document.getElementById('arrow').style.transform = "rotate(0deg)";
  document.getElementById('subTsksBoard').innerHTML = '';
  document.getElementById('selCntcts').innerHTML = '';
  document.getElementById('moreIcon').classList.add("d_noneImg");
}

/**
 * Resets error messages and UI styles for input validation.
 */
function resetError() {
  document.getElementById('failName').classList.add("selectHide");
  document.getElementById('failDueDate').classList.add("selectHide");
  document.getElementById('failCategory').classList.add("selectHide");
  document.getElementById('titleText').classList.remove("failedinput");
  document.getElementById('dateData').classList.remove("failedinput");
  document.getElementById('customSelect').classList.remove("failedinput");
}