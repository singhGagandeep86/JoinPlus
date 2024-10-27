/**
 * Generates an HTML template for an empty task board.
 * This template displays a message indicating that there are no tasks to do.
 *
 * @function templateTaskEmptyTodo
 * @returns {string} The HTML string for the empty task board.
 */
function templateTaskEmptyTodo() {
    return `<div class="emptyBoardArea"><span>No tasks To do</span></div>
    `
}

/**
 * Generates an HTML template for an empty "In Progress" task board.
 * This template displays a message indicating that there are no tasks in progress.
 *
 * @function templateTaskEmptyInProgress
 * @returns {string} The HTML string for the empty "In Progress" task board.
 */
function templateTaskEmptyInProegress() {
    return `<div class="emptyBoardArea"><span>No tasks to in progress</span></div>
    `
}

/**
 * Generates an HTML template for an empty "Awaiting Feedback" task board.
 * This template displays a message indicating that there are no tasks awaiting feedback
 * and includes a placeholder for drag-and-drop functionality.
 *
 * @function templateTaskEmptyAwait
 * @returns {string} The HTML string for the empty "Awaiting Feedback" task board.
 */
function templateTaskEmptyAwait() {
    return `<div class="emptyBoardArea"><span>No tasks to await feedback</span></div>
    <div id="dragEmpty" class="dragEmptyBody d_none"></div>`
}

/**
 * Generates an HTML template for an empty "Done" task board.
 * This template displays a message indicating that there are no tasks marked as done
 * and includes a placeholder for drag-and-drop functionality.
 *
 * @function templateTaskEmptyDone
 * @returns {string} The HTML string for the empty "Done" task board.
 */
function templateTaskEmptyDone() {
    return `<div class="emptyBoardArea"><span>No tasks to done</span></div>
    <div id="dragEmpty" class="dragEmptyBody d_none "></div>`
}

/**
 * Generates an HTML template for a task creation popup.
 * This template includes fields for the task title, description, due date,
 * priority, category, assigned contacts, and subtasks.
 *
 * @function templatePopUpTask
 * @param {number} id - The ID associated with the task being created.
 * @returns {string} The HTML string for the task creation popup.
 */
function templatePopUpTask(id) {
    return `<div id="CloseArea" class="taskArea">
         <div class="headingBoardAdd">Add Task <img onclick="closePopUpTask()" src="../img/Close.png" alt=""></div>
           <form id="myForm">
                    <div class="formular">
                        <div class="leftSubmition">
                            <div class="title">
                                <div class="smallHead"><span>Title <sup>*</sup></span>
                                </div>
                                <input id="titleText" class="titleTxt" type="text" placeholder="Enter a title"
                                    oninput="clearFailAddTask('titleText', 'failName')">
                                <div id="failName" class="fail selectHide"><span>Please enter a correct Task in text
                                        Format.</span></div>
                            </div>
                            <div class="description">
                                <div class="smallHead">Description</div>
                                <textarea rows="4" cols="37" placeholder="Enter a Description" id="desText"
                                    class="descriptionTxt"></textarea>
                            </div>
                            <div class="assignCntcts">
                                <label for="contacts">Assigned to</label>
                                <div class="assignment" id="assign" onclick="showCheckBoxes()">
                                    Select contacts to assign
                                    <img class="arrow" id="arrow" src="../img/dropArrow.svg">
                                </div>
                                <div id="allCntcts" class="checkboxes">
                                </div>
                                <div class="selCntctsDiv">
                                    <div id="selCntcts" class="showSel"></div>
                                    <div id="moreIcon" class="moreBtn d_noneImg" onclick="scrollOn()"><img class="moreImg" src="../img/arrow.png"></div>
                                </div>
                            </div>
                        </div>
                        <div class="partition"></div>
                        <div class="rightSubmition">
                            <div class="dueDate">
                                <div class="smallHead"><span>Due Date <sup>*</sup></span>
                                </div>
                                <input class="dueDateTxt" type="text" id="dateData" placeholder="dd/mm/yyyy"
                                    onfocus="(type='date')">
                                <div id="failDueDate" class="fail selectHide"><span>Please select a correct Due
                                        Date.</span></div>
                            </div>
                            <div id="priority" class="prio">
                                <div class="smallHead">Prio</div>
                                <div class="prioForm">
                                    <input type="radio" name="priority" value="urgent" id="urgent">
                                    <label class="prioBtn" for="urgent">Urgent <img
                                            src="../img/Priorityhigh.png"></label>
                                    <input type="radio" name="priority" value="medium" id="medium" checked>
                                    <label class="prioBtn" for="medium">Medium <img
                                            src="../img/Prioritymiddel.png"></label>
                                    <input type="radio" name="priority" value="low" id="low">
                                    <label class="prioBtn" for="low">Low <img src="../img/Prioritylow.png"></label>
                                </div>
                            </div>
                            <div class="assign">
                                <label for="hiddenSelect"><span>Category<sup>*</sup></span></label>
                                <div class="assignments" id="customSelect" onclick="toggleDropdown()">
                                    Select task category
                                </div>
                                <select id="hiddenSelect">
                                    <option value="" disabled selected>Select task category</option>
                                    <option value="technical">Technical Task</option>
                                    <option value="userStory">User Story</option>
                                </select>
                                <div id="dropdown" class="selectItems selectHide">
                                    <div data-value="technical" onclick="selectOption(this)">Technical Task</div>
                                    <div data-value="userStory" onclick="selectOption(this)">User Story</div>
                                </div>
                                <div id="failCategory" class="fail selectHide"><span>Please select a Category for
                                        Task.</span></div>
                            </div>

                            <div id="inputSubClass" class="subtasks">
                                <div class="smallHead">Subtasks</div>
                                <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt"
                                        placeholder="Add new subtask" type="text">
                                    <img class="tsksGen" src="../img/subTaskIcon.svg">
                                </div>
                            </div>
                            <ul class="a" id="subTsksBoard"></ul>
                        </div>
                    </div>
                    <div class="info">
                        <div><sup>* </sup>This field is required</div>
                        <div class="submitionButtons">
                            <button class="secondary" type="reset" onclick="resetAll()">
                                <span>Clear</span> </button>
                            <button id="btnAddTaskBoard" type="button" class="primaryCheck" onclick="addTaskboard(${id})">
                            <span>Create Task</span><img class="primevect" src="../img/check.svg">
                            </button>
                        </div>
                    </div>
                </form>  
        </div>`
}

/**
 * Generates an HTML template for a task element.
 * This template includes task information such as category, title, description,
 * priority, and allows for drag-and-drop functionality.
 *
 * @function templateTaskHTML
 * @param {Object} element - The task data object.
 * @param {number} element.number - The unique identifier for the task.
 * @param {string} element.color - The color associated with the task category.
 * @param {string} element.category - The category of the task.
 * @param {string} element.title - The title of the task.
 * @param {string} element.description - The description of the task.
 * @param {string} element.prio - The priority level of the task.
 * @returns {string} The HTML string representing the task element.
 */
function templateTaskHTML(element) {
    let rangeId = `subtaskRange-${element['number']}`;
    let contactpic = `contact-${element['number']}`;
    return `<div id="taskAll" onclick="openPopUpTaskSmall(${element['number']})" class="task" draggable="true" ondragstart="startDragging(${element['number']}, this) ">
    <div class="taskInfo">
        <div id="taskSwitch" class="taskName">
        <span class="bg_${element['color']}">${element['category']}</span>
        <span  onclick="openPopUpTaskSwitch(${element['number']});event.stopPropagation();"><img class="arrowImg" id="arrowSwitch${element['number']}" src="../img/arrow_drop_downaa.svg" alt=""></span>
        </div>
        <div class="taskTitle">
            <span>${element['title']}</span>
            <span>${element['description']}</span>
        </div>
        <div id="${rangeId}"></div>
    <div id="contactAreaPic-${element['number']}" class="contactAndPrioArea" onmouseover="checkForOverflow(${element['number']})" ondragstart="preventDrag(${element['number']}, event)"><div id="${contactpic}" class="contact" ></div>
    <div class="bg_${element['prio']}"></div> </div>
    <div id="popupTaskSwitch${element['number']}" class="taskSwitchArea d_none" ></div>
    </div>
    </div>`;
}

/**
 * Generates an HTML template for displaying detailed information about a task.
 * This template includes the task's category, title, description, due date, priority,
 * assigned contacts, and subtasks, along with options to edit or delete the task.
 *
 * @function templateTaskSmallInfo
 * @param {Object} objDateTask - The task data object.
 * @param {number} objDateTask.number - The unique identifier for the task.
 * @param {string} objDateTask.color - The color associated with the task category.
 * @param {string} objDateTask.category - The category of the task.
 * @param {string} objDateTask.title - The title of the task.
 * @param {string} objDateTask.description - The description of the task.
 * @param {string} objDateTask.prio - The priority level of the task.
 * @returns {string} The HTML string representing the task detail popup.
 */
function templateTaskSmallInfo(objDateTask) {

    return `<div id="closeAreaInfo" class="popupTaskInfo">
    <div class="smallTaskData">
            <div class="infoTitle"><div><span class=" bgInfo_${objDateTask.color}" >${objDateTask.category}</span>
            </div><img onclick="closePopUpTaskSmall()" src="../img/Close.png" alt=""></div>
            <div class="popupTitleInfo">${objDateTask.title}</div>
            <div class="descriptionInfo">${objDateTask.description}</div>
            <div class="dateInfo"><div><span>Due date:</span></div><div id="dateAreaInfo"></div></div>
            <div class="prioInfo"><div><span>Priorty:</span></div>
            <div class="prioInfoData"><span>${objDateTask.prio.charAt(0).toUpperCase() + objDateTask.prio.slice(1)}</span>
            <div class="bg_${objDateTask.prio}"></div></div></div>
            <div class="contactInfo"><span class="contactInfoHeadline">Assigned To:</span><div id="contactAreaInfo" class="contactInfoData"></div></div>
            <div class="subtaskInfo"><span>Subtasks:</span><div id="subtaskEmtpy"  class="subtaskAreaData"><div id="subtaskArea"></div></div></div>
            <div class="editInfo"><div class="editInfoData"><div><img onclick="deleteData(${objDateTask.number})" class="deletePic" src="../img/Deletecontact.png" alt=""></div>
                <div><img onclick="editOpen(${objDateTask.number})" class="editPic" src="../img/editcontacts.png" alt=""></div></div></div>
        </div>
        </div>`;
}

/**
 * Generates an HTML template for a progress bar displaying the completion status of subtasks.
 * This template includes a progress element and a label showing the count of checked subtasks
 * against the total number of subtasks.
 *
 * @function templateRange
 * @param {number} subtask - The total number of subtasks.
 * @param {number} checkedCount - The number of completed subtasks.
 * @returns {string} The HTML string representing the progress bar for subtasks.
 */
function templateRange(subtask, checkedCount) {
    return ` <div class="range"><progress id="subTaskRange" max="${subtask}" value="${checkedCount}"></progress>
    <span>${checkedCount}/${subtask} Subtasks</span></div>`
}

/**
 * Generates an HTML template for a contact display box.
 * This template includes a colored box with the contact's initials.
 *
 * @function templateContact
 * @param {string} colors - The color class to apply to the contact box.
 * @param {string} initials - The initials of the contact to display.
 * @param {number} i - The index or identifier for the contact (not used in the template).
 * @returns {string} The HTML string representing the contact box.
 */
function templateContact(colors, initials, i) {
    return ` <div class="b-${colors} box0"> <span>${initials}</span></div>`
}

/**
 * Generates an HTML template for displaying contact information.
 * This template includes a colored box with the contact's initials and the full contact name.
 *
 * @function templateContactInfo
 * @param {string} contactscolor - The color class to apply to the contact box.
 * @param {string} initials - The initials of the contact to display.
 * @param {string} contactName - The full name of the contact.
 * @returns {string} The HTML string representing the contact information display.
 */
function templateContactInfo(contactscolor, initials, contactName) {
    return `<div class="contactArea"><div class="b-${contactscolor} boxinfo">
    <span>${initials}</span></div> <span class="contactName">${contactName}</span></div>`
}

/**
 * Generates an HTML template for a subtask with a checkbox.
 * This template includes a checkbox input for the subtask and its title.
 *
 * @function templateSubtask
 * @param {string} element - The title of the subtask.
 * @param {Object} objDateTask - The task data object.
 * @param {number} objDateTask.number - The unique identifier for the task.
 * @param {number} j - The index of the subtask.
 * @returns {string} The HTML string representing the subtask with a checkbox.
 */
function templateSubtask(element, objDateTask, j) {
    let checkboxId = `checkbox-${objDateTask.number}-${j}`;
    return `
       <div class="subtastTitle"><label class="labelInfo"><input id="${checkboxId}" oninput="inputCheckBoxInfo(${objDateTask.number}, ${j})" type="checkbox" class="checkboxDesign" name="subtask"> <span></span><p>${element}</p></label></div>
        `
}

/**
 * Generates an HTML template for a task movement interface.
 * This template includes buttons to move a task to different statuses: "In Progress", "Await", and "Done".
 *
 * @function moveTaskTo1
 * @param {number} element - The unique identifier for the task.
 * @returns {string} The HTML string representing the task movement options.
 */
function moveTaskTo1(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}

/**
 * Generates an HTML template for a task movement interface.
 * This template includes buttons to move a task to different statuses: "To Do", "Await", and "Done".
 *
 * @function moveTaskTo2
 * @param {number} element - The unique identifier for the task.
 * @returns {string} The HTML string representing the task movement options.
 */
function moveTaskTo2(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}

/**
 * Generates an HTML template for a task movement interface.
 * This template includes buttons to move a task to different statuses: "To Do", "In Progress", and "Done".
 *
 * @function moveTaskTo3
 * @param {number} element - The unique identifier for the task.
 * @returns {string} The HTML string representing the task movement options.
 */
function moveTaskTo3(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}

/**
 * Generates an HTML template for a task movement interface.
 * This template includes buttons to move a task to different statuses: "To Do", "In Progress", and "Await".
 *
 * @function moveTaskTo4
 * @param {number} element - The unique identifier for the task.
 * @returns {string} The HTML string representing the task movement options.
 */
function moveTaskTo4(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button></div>`
}

/**
 * Generates an HTML template for editing a task.
 * This template includes fields for the task's title, description, due date, priority,
 * assigned contacts, and subtasks. It also provides a button to confirm the edits.
 *
 * @function editTask
 * @param {Object} objData - The data object representing the task to be edited.
 * @param {string} objData.title - The current title of the task.
 * @param {string} objData.date - The current due date of the task.
 * @param {number} objData.number - The unique identifier for the task.
 * @returns {string} The HTML string representing the edit task interface.
 */
function editTask(objData) {
    return `<div id="EditCloseArea" class="popupEdit" onclick="closeDropDownContact()">
    <div class="closeIconEdit"><img onclick="closePopUpTaskSmall()" src="../img/Close.png" alt=""></div>
    <div id="edit" class="editArea">
     <div class="title">
            <div class="smallHead titleStyle"><span>Title</span>
            </div>
            <input id="titleEditFail" class="titleInput " type="text" value="${objData.title}" oninput="clearFailAdd()">
            <div id="failTitleEditBoard" class="fail d_none "><span>Please enter a title</span></div>
        </div>
        <div class="description">
            <div class="smallHead descSytle">Description</div>
            <textarea  rows="4" cols="37"  class="textAreaData"></textarea>
        </div>

     <div class="dueDate">
            <div class="smallHead dateStyle"><span>Due Date</span>
            </div>
            <input id="dateEditEnter"  class="DueDate" type="text" value="${objData.date}" onfocus="(this.type='date')">
        </div>
      <div class="prioArea">
    <span>Priority</span>
    <div class="prioForm">
        <input type="radio" name="priority" value="urgent" id="urgent">
        <label class="prioBtn" for="urgent">Urgent <img src="../img/Priorityhigh.png" alt=""></label>

        <input type="radio" name="priority" value="medium" id="medium">
        <label class="prioBtn" for="medium">Medium <img src="../img/Prioritymiddel.png" alt=""></label>

        <input type="radio" name="priority" value="low" id="low">
        <label class="prioBtn" for="low">Low <img src="../img/Prioritylow.png" alt=""></label>
    </div>
</div>
<div class="assignedStyle"><span>Assigned to</span></div>
<div id="contactDropStart" class="contactDrop" onclick="contactDropOpen(event)"><span>Select Contacts to assgin</span> <img id="arrowContactDrop"  src="../img/arrow_drop_runter.png" alt=""></div>
<div id="contactDropArea" class="contactDropData d_none" onclick="event.stopPropagation()"></div>
<div id="initialsArea" class="initialsEdit"></div>
<div class="subtaskStyle"><span>Subtaskt</span></div>
  <div id="subtaskInput" class="substart"></div>
    <ul id="subTaskBoard" class="ulArea" ></ul>
    </div>

    <div onclick="readEditData(${objData.number})" class="editAdd"> <span>Ok</span><img class="primevect" src="../img/check.svg"></div>
    </div>`
}

/**
 * Generates an HTML template for a checkbox contact item.
 * This template includes a checkbox for selecting a contact, along with the contact's name,
 * initials, and color representation.
 *
 * @function checkboxContactTemplate
 * @param {string} isChecked - A string representing whether the checkbox is checked (`'checked'` or an empty string).
 * @param {string} contactName - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color associated with the contact, used for styling.
 * @returns {string} The HTML string representing the checkbox contact item.
 */
function checkboxContactTemplate(isChecked, contactName , initials, color) {
    return ` <div class="contactDropCheck"><label class="labelContact"><input type="checkbox" class="checkboxDesignContact" name="contact" ${isChecked} ><div class="checkImg"><span></span></div><div class="contactNameEdit"><p>${contactName}</p> <div class="b-${color} boxinfoEdit"><span>${initials}</span></div></div> </label></div>`
}

/**
 * Generates an HTML template for a checkbox contact item without a checked state.
 * This template includes a checkbox for selecting a contact, along with the contact's name,
 * initials, and color representation.
 *
 * @function checkboxContactTemplateEmpty
 * @param {string} contactName - The name of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {string} color - The color associated with the contact, used for styling.
 * @returns {string} The HTML string representing the checkbox contact item without a checked state.
 */
function checkboxContactTemplateEmpty( contactName , initials, color) {
    return ` <div class="contactDropCheck"><label class="labelContact"><input type="checkbox" class="checkboxDesignContact" name="contact" ><div class="checkImg"><span></span></div><div class="contactNameEdit"><p>${contactName}</p> <div class="b-${color} boxinfoEdit"><span>${initials}</span></div></div> </label></div>`
}

/**
 * Generates an HTML template for displaying contact initials with a specified background color.
 * 
 * @function initialsLoadContact
 * @param {string} initials - The initials of the contact to be displayed.
 * @param {string} colorIni - The background color associated with the initials.
 * @returns {string} The HTML string representing the contact initials with styling.
 */
function initialsLoadContact(initials, colorIni) {
    return ` <div class="b-${colorIni} boxinfo "><span>${initials}</span></div> `
}

/**
 * Generates an HTML template for a button to add a new subtask.
 * The button displays a prompt to add a subtask and includes a plus icon.
 * 
 * @function subtaskstart
 * @returns {string} The HTML string representing the button to add a new subtask.
 */
function subtaskstart() {
    return `<div onclick="subtastAdd()" class="substart2">
                <span>Add new subtask</span>
                <span>+</span>
            </div>`;
}

/**
 * Generates an HTML template for a subtask input field with options to add or delete the subtask.
 * This template includes an input field for the subtask name and buttons for adding or deleting the input.
 * 
 * @function subtaskAdd
 * @returns {string} The HTML string representing the subtask input area with action buttons.
 */
function subtaskAdd() {
    return `<div class="subAddIn">
                <input id="subInput" class="inputSub" type="text">
                <div class="addDeletInput">
                    <span><img onclick="deletInput()" src="../img/Propertydelete.png" alt=""></span>
                    <div class="strich"></div>
                    <span><img onclick="addInputSubtastk()" src="../img/Propertycheck.png" alt=""></span>
                </div>
            </div>`;
}

function addSubTask(inputValue) {
    return `
    <li class="liSubTask" ondblclick="editSubTask(this)">
        <span class="taskText">• ${inputValue}</span>
        <div class="addDelet">
            <div class="strich"></div>
            <span>
                <img onclick="deleteTask(event)" src="../img/Propertydelete.png" alt="Delete">
            </span>
            <div class="strich"></div>
            <span>
                <img onclick="toggleEditTask(event, this)" src="../img/Propertycheck.png" alt="Save">
            </span>
        </div>
        <input class="inputSubAdd hidden" type="text" value="${inputValue}" style="display:none">
    </li>`;
}

/**
 * Generates an HTML template for a subtask list item.
 * The template includes the subtask text, options to delete the subtask, and an edit option.
 * 
 * @function addSubTask
 * @param {string} inputValue - The text value of the subtask to be displayed.
 * @returns {string} The HTML string representing a subtask list item with actions for editing and deleting.
 */
function templateSub1(currentText) {
    return `
    <input class="inputSubAdd" type="text" value="${currentText}">
    <div class="addDelet">
        <span><img onclick="deleteTask(event)" src="../img/Propertydelete.png" alt="Delete"></span>
        <div class="strich"></div>
        <span><img onclick="saveTask(event, this)" src="../img/Propertycheck.png" alt="Save"></span>
    </div>`;
}

/**
 * Generates an HTML template for a subtask element with options to delete or save the subtask.
 * The template includes the subtask text and action icons for deletion and saving.
 * 
 * @function templateSub2
 * @param {string} newValue - The text value of the subtask to be displayed.
 * @returns {string} The HTML string representing a subtask with action buttons.
 */
function templateSub2(newValue) {
    return `<span class="taskText">• ${newValue}</span>
            <div class="addDelet">
                <span><img onclick="deleteTask(event)" src="../img/Propertydelete.png" alt="Delete"></span>
                <div class="strich"></div>
                <span><img onclick="toggleEditTask(event, this)" src="../img/Propertycheck.png" alt="Save"></span>
            </div>`;
}

/**
 * Generates an HTML template for a subtask element, providing options to delete or edit/save the subtask.
 * The template includes the subtask text and action icons for deletion and toggling between edit and save.
 * 
 * @function templateSub3
 * @param {string} newValue - The text value of the subtask to be displayed.
 * @returns {string} The HTML string representing a subtask with action buttons for deletion and editing.
 */
function templateSub3(newValue) {
    return`  <span class="taskText">• ${newValue}</span>
            <div class="addDelet">
                <span><img onclick="deleteTask(event)" src="../img/Propertydelete.png" alt="Delete"></span>
                <div class="strich"></div>
                <span><img onclick="toggleEditTask(event, this)" src="../img/Propertycheck.png" alt="Edit/Save"></span>
            </div>`
}

/**
 * Generates an HTML template for an editable subtask input field.
 * The template includes an input field for the subtask text and action icons for deleting or editing/saving the subtask.
 * 
 * @function templateSub4
 * @param {string} currentText - The current text value of the subtask to be displayed in the input field.
 * @returns {string} The HTML string representing an editable subtask with action buttons.
 */
function templateSub4(currentText) {
    return`
        <input class="inputSubAdd" type="text" value="${currentText}">
        <div class="addDelet">
            <span><img onclick="deleteTask(event)" src="../img/Propertydelete.png" alt="Delete"></span>
            <div class="strich"></div>
            <span><img onclick="toggleEditTask(event, this)" src="../img/Propertycheck.png" alt="Edit/Save"></span>
        </div>`
}