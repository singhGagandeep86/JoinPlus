
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
         <div class="headingBoardAdd">Add Task <img onclick="closePopUpTask()" src="../img/Close.png" alt=""></div>
                <form id="myFormBoard">
                    <div class="formular">
                        <div class="leftSubmition">
                            <div class="title">
                                <div class="smallHead"><span>Title <sup>*</sup></span>
                                </div>
                                <input id="titleText" class="titleTxt" type="text" placeholder="Enter a title" required>
                            </div>
                            <div class="description">
                                <div class="smallHead">Description</div>
                                <textarea rows="4" cols="37" placeholder="Enter a Description" id="desText" class="descriptionTxt"></textarea>
                            </div>
                            <div class="assignCntcts">
                                <label for="contacts">Assigned to</label>
                                <div class="assignment" id="assign" onclick="showCheckBoxes()">
                                    Select contacts to assign
                                    <img class="arrow" id="arrow" src="../img/dropArrow.svg">
                                </div>
                                <div id="allCntcts" class="checkboxes">
                                </div>
                                <div id="selCntcts" class="showSel"></div>
                            </div>
                        </div>
                        <div class="partition"></div>
                        <div class="rightSubmition">
                            <div class="dueDate">
                                <div class="smallHead"><span>Due Date <sup>*</sup></span>
                                </div>
                                <input class="dueDateTxt" type="text" id="dateData" placeholder="dd/mm/yyyy"
                                    onfocus="(this.type='date')" required>
                            </div>
                            <div id="priority" class="prio">
                                <div class="smallHead">Prio</div>
                                <div class="prioBtns">
                                    <div id="btnUrgnt" onclick="activateUrgent()" class="priobtn urgnt">Urgent <img
                                            src="/assets/img/prioUrgent.svg"></div>
                                    <div id="btnMed" onclick="activateMedium()" class="priobtn med">Medium <img
                                            src="/assets/img/prioMedium.svg"></div>
                                    <div id="btnLow" onclick="activateLow()" class="priobtn low">Low <img
                                            src="/assets/img/prioLow.svg"></div>
                                </div>
                            </div>
                            <div class="assign">
                                <label for="Category"><span>Category <sup>*</sup></span></label>
                                <div class="assignment" id="assignHeading" onclick="showCategory()">
                                    Select task category
                                    <img class="arrow" id="arrowRight" src="../img/dropArrow.svg">
                                </div>
                                <div id="slection" class="selectItems selectHide">
                                    <div data-value="technical" onclick="showSelection(this)">Technical Task</div>
                                    <div data-value="userStory" onclick="showSelection(this)">User Story</div>
                                </div>
                            </div>

                            <div id="inputSubClass" class="subtasks">
                                <div class="smallHead">Subtasks</div>
                                <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt"
                                        placeholder="Add new subtask" type="text">
                                    <img class="tsksGen" src="/assets/img/subTaskIcon.svg">
                                </div>
                            </div>
                            <ul class="a" id="subTsksBoard"></ul>
                        </div>
                    </div>
                    <div class="info">
                        <div><sup>* </sup>This field is required</div>
                        <div class="submitionButtons">
                            <button class="cancelBtnAdd" type="reset" onclick="closePopUpTask()">
                                <span>Cancel</span> </button>
                            <button type="submit" class="primaryCheck">
                                <span>Create Task</span><img class="primevect" src="/assets/img/check.svg">
                            </button>
                        </div>
                    </div>
                </form>
        </div>`
}
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
    <div class="contactAndPrioArea"><div id="${contactpic}" class="contact"></div>   
    <div class="bg_${element['prio']}"></div> </div>
    <div id="popupTaskSwitch${element['number']}" class="taskSwitchArea d_none" ></div>
    </div>
    </div>`;
}

function templateTaskSmallInfo(objDateTask) {
    
    return `<div id="closeAreaInfo" class="popupTaskInfo">
            <div class="infoTitle"><div><span class=" bgInfo_${objDateTask.color}" >${objDateTask.category}</span>
            </div><img onclick="closePopUpTaskSmall()" src="../img/Close.png" alt=""></div>
            <div class="popupTitleInfo">${objDateTask.title}</div>
            <div class="descriptionInfo">${objDateTask.description}</div>
            <div class="dateInfo"><div><span>Due date:</span></div><div id="dateAreaInfo"></div></div>
            <div class="prioInfo"><div><span>Priorty:</span></div>
            <div class="prioInfoData"><span>${objDateTask.prio.charAt(0).toUpperCase() + objDateTask.prio.slice(1)}</span>
            <div class="bg_${objDateTask.prio}"></div></div></div>
            <div class="contactInfo"><span class="contactInfoHeadline">Assigned To:</span><div id="contactAreaInfo" class="contactInfoData"></div></div>
            <div class="subtaskInfo"><span>Subtasks:</span><div  class="subtaskAreaData"><div id="subtaskArea"></div></div></div>
            <div class="editInfo"><div class="editInfoData"><div><img onclick="deleteData(${objDateTask.number})" class="deletePic" src="../img/Delete contact.png" alt=""></div>
                <div><img onclick="editOpen(${objDateTask.number})" class="editPic" src="../img/edit contacts.png" alt=""></div></div></div>
        </div>`;
}
function templateRange(subtask, checkedCount) {
    return ` <div class="range"><progress id="subTaskRange" max="${subtask}" value="${checkedCount}"></progress>
    <span>${checkedCount}/${subtask} Subtasks</span></div>`
}

function templateContact(colors, initials, i) {
    return ` <div class="b-${colors} box${i}"> <span>${initials}</span></div>`
}

function templateContactInfo(contactscolor, initials, contactName) {
    return `<div class="contactArea"><div class="b-${contactscolor} boxinfo">
    <span>${initials}</span></div> <span class="contactName">${contactName}</span></div>`
}

function templateSubtask(element, objDateTask, j) {
    let checkboxId = `checkbox-${objDateTask.number}-${j}`;
    return `
       <div class="subtastTitle"><label class="labelInfo"><input id="${checkboxId}" oninput="inputCheckBoxInfo(${objDateTask.number}, ${j})" type="checkbox" class="checkboxDesign" name="subtask"> <span></span><p>${element}</p></label></div>
        `
}

function moveTaskTo1(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo2(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo3(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo4(element) {
    return `<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button></div>`
}


function addSubTask(subTaskData) {
    return ` <li class="liSubTask">• ${subTaskData} </li>`
}
function editTask(objData) {
    return `<div class="popupEdit">
    <div id="edit" class="editArea">
     <div class="title">
            <div class="smallHead"><span>Title</span>
            </div>
            <input class="titleInput" type="text" value="${objData.title}" required>
        </div>
        <div class="description">
            <div class="smallHead">Description</div>
            <textarea  rows="4" cols="37"  class="textAreaData"></textarea>
        </div>
      
     <div class="dueDate">
            <div class="smallHead"><span>Due Date</span>
            </div>
            <input class="DueDate" type="text" value="${objData.date}" onfocus="(this.type='date')" required>
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
<div><span>Assigned to</span></div>
<div class="contactDrop" onclick="contactDropOpen()"><span>Select Contacts to assgin</span> <img id="arrowContactDrop"  src="../img/arrow_drop_runter.png" alt=""></div>
<div id="contactDropArea" class="contactDropData d_none"></div>
<div id="initialsArea" class="initialsEdit"></div>
    
<div><span>Subtaskt</span></div>
    <ul id="subTaskBoard" class="ulArea" ></ul>   
    
    </div>
    
    <div class="editAdd"> <span>Ok</span><img class="primevect" src="../img/check.svg"></div> 
    
    </div>`
}

function checkboxContactTemplate(isChecked, contactName , initials, color) {
    return ` <div class="contactDropCheck"><label class="labelContact"><input type="checkbox" class="checkboxDesignContact" name="contact" ${isChecked} ><div class="checkImg"><span></span></div><div class="contactNameEdit"><p>${contactName}</p> <div class="b-${color} boxinfoEdit"><span>${initials}</span></div></div> </label></div>`
}


function initialsLoadContact(initials, colorIni) {
    return ` <div class="b-${colorIni} boxinfo "><span>${initials}</span></div> `    
}
