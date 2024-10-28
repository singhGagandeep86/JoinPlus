/**
 * Generates an HTML template for displaying a contact item with a checkbox.
 *
 * @param {string} sanitizedEachName - The sanitized name for the contact, used for the checkbox ID.
 * @param {string} colour - The color associated with the contact.
 * @param {string} eachName - The full name of the contact to display.
 * @param {string} firstNameStart - The first letter of the contact's first name.
 * @param {string} lastNameStart - The first letter of the contact's last name, or an empty string if none.
 * @returns {string} - The HTML string template for the contact item, including a checkbox and initials.
 */
function contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart) {
    return `<label>
    <input type="checkbox"class="checkboxDesign" id="${sanitizedEachName}" onchange="selectionContact('${sanitizedEachName}', '${colour}')">
    <span value="${sanitizedEachName}"></span>${eachName}
    <div class="namesInitials b-${colour}">${firstNameStart}${lastNameStart}</div>
    </label>`;
}

/**
 * Generates an HTML template for a subtask input field with accompanying buttons for adding or canceling the subtask.
 *
 * @returns {string} - The HTML string for the subtask input area, including an input field and action buttons.
 */
function subTaskTemp() {
    return `<div class="smallHead">Subtasks</div>
    <div class="inputWrapper">
    <input id="inputField" class="subtasksTxt" placeholder="Add  new subtask" type="text" onfocus="renderSubTask()">
    <div class="tsksBtns"><img class="inputIcon" src="../img/subTaskCancel.svg" onclick="resetInput()"><img onclick="addList()" class="inputIcon2" src="../img/subTaskEnter.svg"></div>
</div>`;
}

/**
 * Generates an HTML list item template for displaying a subtask with edit and delete options.
 *
 * @param {string} subTaskInput - The text of the subtask.
 * @returns {string} - The HTML string for a list item containing the subtask, with edit and delete buttons.
 */
function generatedList(subTaskInput) {
    return `<li onmouseover="hoverEffect(this)" onmouseleave="normalEffect(this)" ondblclick="editsubTask(this)">
    <div class="leftPart"><span class="bullet"></span>${subTaskInput}</div>
    <div class="btns subTaskIcon">
    <img onclick="editsubTask(this, '${subTaskInput}')" class="inputIcon" src="../img/SubtasksEdit.png">
    <img onclick="delsubTask(this)" class="deleteIcon" src="../img/SubtasksDel.png">
</div></li>`;
}

/**
 * Generates an HTML template for an empty subtask field.
 *
 * @returns {string} - The HTML string template for an empty subtask input area, including a placeholder and an icon.
 */
function emptyField() {
    return `<div class="smallHead">Subtasks</div>
    <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt" placeholder="Add new subtask" type="text">
    <img class="tsksGen" src="../img/subTaskIcon.svg"></div>`;
}

/**
 * Generates an HTML template for editing a subtask, with an input field prefilled with the current subtask value.
 *
 * @param {string} currentValue - The current text of the subtask to be edited.
 * @returns {string} - The HTML string template for the editable subtask, including save and delete buttons.
 */
function editTempelate(currentValue) {
    return `<div class="wrapper">
  <input type="text" value="${currentValue}" class="subTaskInput"></input> 
  <div class="btns subTaskIcon subTaskEdit">
  <img class="inputIcon" onclick="delsubTask(this)" src="../img/subTaskDelete.svg">
  <img class="deleteIcon" onclick="newSubTask(this)" src="../img/subTaskDone.svg">
</div></div>`;
}

/**
 * Generates an HTML template for displaying a newly added subtask.
 *
 * @param {string} newValue - The text content of the newly added subtask.
 * @returns {string} - The HTML string template for the added subtask, including edit and delete buttons.
 */
function newSubTemp(newValue) {
    return ` <div class="leftPart"><span class="bullet"></span>${newValue}</div>
 <div class="btns subTaskIcon">
 <img onclick="editsubTask(this, '${newValue}')" class="inputIcon" src="../img/SubtasksEdit.png">
 <img onclick="delsubTask(this)" class="deleteIcon" src="../img/SubtasksDel.png">
</div>`;
}