
function templateRange() {
    return `<span class="range"><input type="range"  id="subTaskRange" min="2" max="2" value="2"> 
    <label class="labelRange" for="subTaskRange">2/2 Subtask</label></span>
`
}
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
                                        src="/assets/img/prioUrgent.svg"></div>
                                <div id="btnMed" onclick="activateMedium()" class="priobtn med">Medium <img
                                        src="/assets/img/prioMedium.svg"></div>
                                <div id="btnLow" onclick="activateLow()" class="priobtn low">Low <img
                                        src="/assets/img/prioLow.svg"></div>
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
                                    src="/assets/img/xPic.png">
                            </button>
                            <button class="primaryCheck">
                                <div class="smallHead">Create Task</div><img class="primevect"
                                    src="/assets/img/check.svg">
                            </button>
                        </div>
                    </div>
                </form>
        </div>`
}
function templateTaskHTML(element) {
    return `<div onclick="openPopUpTaskSmall(${element['number']})" class="task" draggable="true" ondragstart="startDragging(${element['number']}, this) ">
    <div class="taskInfo">
        <span class="bg_${element['color']}">${element['category']}</span>
        <div class="taskTitle">
            <span>${element['title']}</span>
            <span>${element['description']}</span>
        </div>
        <div id="subtaskRange" class="subtaskArea"><span class="range"><input type="range"  id="subTaskRange" min="2" max="2" value="2">
    <label class="labelRange" for="subTaskRange">2/2 Subtask</label></span></div>
    <div  class= "contactAndPrioArea"><div id="contactPic" class="contact">   
   <div class="box${contact[0]['color']} box"> <span>${initialenContact[0]}</span></div>
   <div class="box${contact[1]['color']} box"><span>${initialenContact[1]}</span></div>
   <div class="box${contact[2]['color']} box"><span>${initialenContact[2]}</span></div>
    </div>
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
            <div class="contactInfo"><span>Assigned To:</span> <div id="contactAreaInfo" class="contactInfo" ></div></div>
            
            
        </div>`;
    
}