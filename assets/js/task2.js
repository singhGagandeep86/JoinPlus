
document.addEventListener('DOMContentLoaded', () => {
    const filePicker = document.getElementById('filePicker');
    if (filePicker) {

        filePicker.addEventListener('change', () => {
            const allFiles = filePicker.files;

            if (allFiles.length > 0) {
                Array.from(allFiles).forEach(async file => {
                    const blog = new Blob([file], { type: file.type });

                    const base64 = await blobToBase64(blog);

                    const img = document.createElement('img');
                    img.src = base64;

                    attachments.push({
                        name: file.name,
                        type: file.type,
                        data: base64
                    });

                    loadAttachments();
                })
            }
        })
    }
})


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
 * Event listener to close the contacts dropdown when clicking outside of it.
 * Checks if the click target is not within the dropdown or its triggering element.
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
 *  Sets the minimum date attribute of an input element with ID 'dateData' to today's date.
*/
function setDateDisable() {
    let catchedDate = new Date().toISOString().split('T')[0];
    let inputDate = document.getElementById('dateData');
    inputDate.setAttribute('min', catchedDate);
}

/**
 * Event listener to close the task category dropdown when clicking outside of it.
*/
document.addEventListener('click', function (rightEvent) {
    const assignHeading = document.getElementById('customSelect');
    if (dropdownOpen && !assignHeading.contains(rightEvent.target)) {
        toggleDropdown();
    }
});

/**
 * Resets local variables and UI elements to their initial states.
*/
function resetingLocalVariables() {
    document.getElementById('customSelect').innerHTML = `Select task category`;
    document.getElementById('allCntcts').style.display = "none";
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    document.getElementById('subTsksBoard').innerHTML = '';
    document.getElementById('selCntcts').innerHTML = '';
    document.getElementById('moreIcon').classList.add("d_none");
    document.getElementById('removeAll').classList.add("selectHide");
    document.getElementById('fileList').innerHTML = "";
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
 *  Displays an error message for invalid task input.
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
 *  Adds a new task if validation passes, then navigates to the task board.
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
    pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id, attachments);
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
*/
async function postTask(path = "", data = {}) {
    await fetch(getDatabaseUrl(path), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 * Pushes task data to Firebase.
 */
function pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id, attachments) {
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
        'checked': checked,
        'attachments': attachments
    });
}

/**
 * Generates a random 6-digit number.
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
 *  Checks all validation criteria for task input.
*/
function checkAll(task, dateReg, category) {
    if (!task && dateReg == false && category === `Select task category`) {
        failAll();
        return false;
    }
}

/**
 * Validates the task title against the defined regular expression.
*/
function checkTask(taskReg, task) {
    if (!taskReg.test(task)) {
        failTask();
        return false;
    }
}

/**
 * Validates the provided date and updates the UI to show or hide error messages.
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
    } else {
        return false;
    }
}

/**
 * Compares the entered date with the current date.
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



