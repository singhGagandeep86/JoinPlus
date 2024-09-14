
function templateTaskEmptyTodo() {
    return `<div class="emptyBoardArea"><span>No tasks To do</span></div>
    `
}
function templateTaskEmptyInProegress() {
    return `<div class="emptyBoardArea"><span>No tasks to in progress</span></div>
    `
}
function templateTaskEmptyAwait() {
    return `<div class="emptyBoardArea"><span>No tasks to await feedback</span></div>
    <div id="dragEmpty" class="dragEmptyBody d_none"></div>`
}
function templateTaskEmptyDone() {
    return `<div class="emptyBoardArea"><span>No tasks to done</span></div>
    <div id="dragEmpty" class="dragEmptyBody d_none "></div>`
}

function templatePopUpTask1() {
    return `<div id="CloseArea" class="taskArea">
        <div class="heading">Add Task <img class="closeIconTask" onclick="closePopUpTask()" src="../img/Close.png" alt=""></div>
                <form  onsubmit="submition()">
                    <div class="mainSubmition">
                        <div class="leftSubmition">
                            <div class="title">
                                <div class="smallHead">Title <div class="imp">*</div>
                                </div>
                                <input class="titleTxt" type="text" placeholder="Enter a title" required>
                            </div>
                            <div class="description">
                                <div class="smallHead">Description</div>
                                <textarea  placeholder="Enter a Description"
                                    class="descriptionTxt"></textarea>
                            </div>
                            <div class="assign">
                                <label for="contacts">Assigned to</label>
                                <select class="assignment" id="contacts">
                                    <option value="user">Select contacts to assign</option>
                                </select>
                            </div>
                        </div>
                        <div class="partition"></div>
                        <div class="rightSubmition">
                            <div class="dueDate">
                                <div class="smallHead">Due Date <div class="imp">*</div>
                                </div>
                                <input class="dueDateTxt" type="text" placeholder="dd/mm/yyyy"
                                    onfocus="(this.type='date')" required>
                            </div>
                            <div class="prio">
                            <div class="smallHead">Prio</div>
                            <div class="prioBtns">
                                <div id="btnUrgnt" onclick="activateUrgent()" class="priobtn urgnt">Urgent <img
                                        src="../../assets/img/prioUrgent.svg"></div>
                                <div id="btnMed" onclick="activateMedium()" class="priobtn med">Medium <img
                                        src="../../assets/img/prioMedium.svg"></div>
                                <div id="btnLow" onclick="activateLow()" class="priobtn low">Low <img
                                        src="../../assets/img/prioLow.svg"></div>
                            </div>
                        </div>
                            <div class="assign">
                                <label for="Category">Category <div class="imp">*</div></label>
                                <select class="assignment" id="Category" required>
                                    <option value="">Select task category</option>
                                    <option value="user">User Story</option>
                                    <option value="user">Technical Task</option>
                                </select>
                            </div>
                            <div class="subtasks">
                                <div class="smallHead">Subtasks</div>
                                <input class="subtasksTxt" placeholder="Add  new subtask" type="text">
                            </div>
                        </div>
                    </div>
                    <div class="contentFeet">
                        <div class="smallHead">
                            <div class="imp">*</div>This field is required
                        </div>
                        <div class="submitionButtons">
                            <button class="secondary">
                                <div class="smallHead">Cancel</div><img
                                    src="../../assets/img/xPic.png">
                            </button>
                            <button class="primaryCheck">
                                <div class="smallHead">Create Task</div><img class="primevect"
                                    src="../../assets/img/check.svg">
                            </button>
                        </div>
                    </div>
                </form>
        </div>`
}
function templateTaskHTML(element) {
    let rangeId = `subtaskRange-${element['number']}`;
    let contactpic = `contact-${element['number']}`;
    return `<div onclick="openPopUpTaskSmall(${element['number']})" class="task" draggable="true" ondragstart="startDragging(${element['number']}, this) ">
    <div class="taskInfo">
        <span class="bg_${element['color']}">${element['category']}</span>
        <div class="taskTitle">
            <span>${element['title']}</span>
            <span>${element['description']}</span>
        </div>
        <div id="${rangeId}"></div>
    <div class="contactAndPrioArea"><div id="${contactpic}" class="contact"></div>   
    <div class="bg_${element['prio']}"></div> </div>
    </div>
    </div>`;
}

function templateTaskSmallInfo(i) {
    return `<div id="closeAreaInfo" class="popupTaskInfo">
            <div class="infoTitle"><div><span class=" bgInfo_${array[i].color}" >${array[i].category}</span>
            </div><img onclick="closePopUpTaskSmall()" src="../img/Close.png" alt=""></div>
            <div class="popupTitleInfo">${array[i].title}</div>
            <div class="descriptionInfo">${array[i].description}</div>
            <div class="dateInfo"><div><span>Due date:</span></div><div id="dateAreaInfo"></div></div>
            <div class="prioInfo"><div><span>Priorty:</span></div>
            <div class="prioInfoData"><span>${array[i].prio.charAt(0).toUpperCase() + array[i].prio.slice(1)}</span>
            <div class="bg_${array[i].prio}"></div></div></div>
            <div class="contactInfo"><span class="contactInfoHeadline">Assigned To:</span><div id="contactAreaInfo" class="contactInfoData"></div></div>
            <div class="subtaskInfo"><span>Subtasks:</span><div  class="subtaskAreaData"><div id="subtaskArea"></div></div></div>
            <div class="editInfo"><div class="editInfoData"><div><img class="deletePic" src="../img/Delete contact.png" alt=""></div>
                <div><img class="editPic" src="../img/edit contacts.png" alt=""></div></div></div>
        </div>`;
}
function templateRange(subtask, checkedCount) {
    return ` <div class="range"><progress id="subTaskRange" max="${subtask}" value="${checkedCount}"></progress>
    <span>${checkedCount}/${subtask} Subtasks</span></div>`
}

function templateContact(colors, initials) {
    return ` <div class="box${colors} box"> <span>${initials}</span></div>`
}

function templateContactInfo(contactscolor, initials, contactName) {
    return `<div class="contactArea"><div class="boxInfo${contactscolor} boxinfo">
    <span>${initials}</span></div> <span class="contactName">${contactName}</span></div>`
}

function templateSubtask(element, i, j) {
    let checkboxId = `checkbox-${i}-${j}`;
    return `
       <div class="subtastTitle"><label class="labelInfo"><input id="${checkboxId}" oninput="inputCheckBoxInfo(${i}, ${j})" type="checkbox" class="checkboxDesign" name="subtask"> <span></span><p>${element}</p></label></div>
        `
}