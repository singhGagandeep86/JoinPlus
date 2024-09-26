
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
         <div class="heading">Add Task</div>
                <form onsubmit="submition()">
                    <div class="formular">
                        <div class="leftSubmition">
                            <div class="title">
                                <div class="smallHead"><span>Title <sup>*</sup></span>
                                </div>
                                <input class="titleTxt" type="text" placeholder="Enter a title" required>
                            </div>
                            <div class="description">
                                <div class="smallHead">Description</div>
                                <textarea rows="4" cols="37" placeholder="Enter a Description"
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
                                <div id="selCntcts" class="showSel"></div>
                            </div>
                        </div>
                        <div class="partition"></div>
                        <div class="rightSubmition">
                            <div class="dueDate">
                                <div class="smallHead"><span>Due Date <sup>*</sup></span>
                                </div>
                                <input class="dueDateTxt" type="text" placeholder="dd/mm/yyyy"
                                    onfocus="(this.type='date')" required>
                            </div>
                            <div class="prio">
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
                            <div class="secondary"  onclick="closePopUpTask()">
                                <span>Cancel</span> </div>
                            <button class="primaryCheck" onclick="addingTask()">
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

function templateTaskSmallInfo(i) {
    return `<div id="closeAreaInfo" class="popupTaskInfo">
            <div class="infoTitle"><div><span class=" bgInfo_${arrayLoad[i].color}" >${arrayLoad[i].category}</span>
            </div><img onclick="closePopUpTaskSmall()" src="../img/Close.png" alt=""></div>
            <div class="popupTitleInfo">${arrayLoad[i].title}</div>
            <div class="descriptionInfo">${arrayLoad[i].description}</div>
            <div class="dateInfo"><div><span>Due date:</span></div><div id="dateAreaInfo"></div></div>
            <div class="prioInfo"><div><span>Priorty:</span></div>
            <div class="prioInfoData"><span>${arrayLoad[i].prio.charAt(0).toUpperCase() + arrayLoad[i].prio.slice(1)}</span>
            <div class="bg_${arrayLoad[i].prio}"></div></div></div>
            <div class="contactInfo"><span class="contactInfoHeadline">Assigned To:</span><div id="contactAreaInfo" class="contactInfoData"></div></div>
            <div class="subtaskInfo"><span>Subtasks:</span><div  class="subtaskAreaData"><div id="subtaskArea"></div></div></div>
            <div class="editInfo"><div class="editInfoData"><div><img class="deletePic" src="../img/Delete contact.png" alt=""></div>
                <div><img onclick="editOpen(${i})" class="editPic" src="../img/edit contacts.png" alt=""></div></div></div>
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

function templateSubtask(element, i, j) {
    let checkboxId = `checkbox-${i}-${j}`;
    return `
       <div class="subtastTitle"><label class="labelInfo"><input id="${checkboxId}" oninput="inputCheckBoxInfo(${i}, ${j})" type="checkbox" class="checkboxDesign" name="subtask"> <span></span><p>${element}</p></label></div>
        `
}

function moveTaskTo1(element) {
    return`<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo2(element) {
    return`<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo3(element) {
    return`<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="done" onclick="changeIdTaskValue(this.value, ${element})">Done</button></div>`
}
function moveTaskTo4(element) {
    return`<span class="moveTitle">Move Task To:</span>
    <div class="moveTaskBTN">
    <button value="toDo" onclick="changeIdTaskValue(this.value, ${element})">To do</button>
    <button value="progress" onclick="changeIdTaskValue(this.value, ${element})">In progress</button>
    <button value="await" onclick="changeIdTaskValue(this.value, ${element})">Await</button></div>`
}

function editTask() {
    return` <div class="popupEdit">
        <div id="edit" class="editArea">
                        <div class="leftSubmition">
                            <div class="title">
                                <div class="smallHead"><span>Title <sup>*</sup></span>
                                </div>
                                <input class="titleTxt" type="text" placeholder="Enter a title" required>
                            </div>
                            <div class="description">
                                <div class="smallHead">Description</div>
                                <textarea rows="4" cols="37" placeholder="Enter a Description"
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
                                <div id="selCntcts" class="showSel"></div>
                            </div>
                        </div>
                        
                        <div class="rightSubmition">
                            <div class="dueDate">
                                <div class="smallHead"><span>Due Date <sup>*</sup></span>
                                </div>
                                <input class="dueDateTxt" type="text" placeholder="dd/mm/yyyy"
                                    onfocus="(this.type='date')" required>
                            </div>
                            <div class="prio">
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
                           

                            <div id="inputSubClass" class="subtasks">
                                <div class="smallHead">Subtasks</div>
                                <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt"
                                        placeholder="Add new subtask" type="text">
                                    <img class="tsksGen" src="/assets/img/subTaskIcon.svg">
                                </div>
                            </div>
                            <ul class="a" id="subTsksBoard"></ul>
                        </div>
                        <span>Create Task</span><img class="primevect" src="/assets/img/check.svg">
                      
                    </div>
                    
                    </div>
                    </div>
                      `
}

function editTask1(){
    return `<div class="popupEdit">
    <div id="edit" class="editArea">
        <div class="title">
            <div class="smallHead"><span>Title <sup>*</sup></span>
            </div>
            <input class="titleTxt" type="text" placeholder="Enter a title" required>
        </div>
        <div class="description">
            <div class="smallHead">Description</div>
            <textarea rows="4" cols="37" placeholder="Enter a Description" class="descriptionTxt"></textarea>
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
        <div class="dueDate">
            <div class="smallHead"><span>Due Date <sup>*</sup></span>
            </div>
            <input class="dueDateTxt" type="text" placeholder="dd/mm/yyyy" onfocus="(this.type='date')" required>
        </div>
        <div class="prio">
            <div class="smallHead">Prio</div>
            <div class="prioBtns">
                <div id="btnUrgnt" onclick="activateUrgent()" class="priobtn urgnt">Urgent <img
                        src="/assets/img/prioUrgent.svg"></div>
                <div id="btnMed" onclick="activateMedium()" class="priobtn med">Medium <img
                        src="/assets/img/prioMedium.svg"></div>
                <div id="btnLow" onclick="activateLow()" class="priobtn low">Low <img src="/assets/img/prioLow.svg">
                </div>
            </div>
        </div>
        <div id="inputSubClass" class="subtasks">
            <div class="smallHead">Subtasks</div>
            <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt" placeholder="Add new subtask"
                    type="text">
                <img class="tsksGen" src="/assets/img/subTaskIcon.svg">
            </div>
            
        </div>
        <ul class="a" id="subTsksBoard"></ul>
      <div class="editAdd"> <span>Ok</span><img class="primevect" src="../img/check.svg"></div> 
    </div>
</div>
    `   
}