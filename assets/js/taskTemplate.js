function contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart) {
    return `<label>
    <input type="checkbox"class="checkboxDesign" id="${sanitizedEachName}" onchange="selectionContact('${sanitizedEachName}', '${colour}')">
    <span value="${sanitizedEachName}"></span>${eachName}
    <div class="namesInitials b-${colour}">${firstNameStart}${lastNameStart}</div>
    </label>`;
}

function subTaskTemp() {
    return `<div class="smallHead">Subtasks</div>
    <div class="inputWrapper">
    <input id="inputField" class="subtasksTxt" placeholder="Add  new subtask" type="text" onfocus="renderSubTask()">
    <div class="tsksBtns"><img class="inputIcon" src="../img/subTaskCancel.svg" onclick="resetInput()"><img onclick="addList()" class="inputIcon2" src="../img/subTaskEnter.svg"></div>
</div>`;
}

function generatedList(subTaskInput) {
    return `<li onmouseover="hoverEffect(this)" onmouseleave="normalEffect(this)" ondblclick="editsubTask(this)">
    <div class="leftPart"><span class="bullet"></span>${subTaskInput}</div>
    <div class="btns subTaskIcon">
    <img onclick="editsubTask(this, '${subTaskInput}')" class="inputIcon" src="../img/SubtasksEdit.svg">
    <img onclick="delsubTask(this)" class="deleteIcon" src="../img/SubtasksDel.svg">
</div></li>`;
}

function emptyField() {
    return `<div class="smallHead">Subtasks</div>
    <div class="inputWrapper" onclick="renderSubTask()"><input class="subtasksTxt" placeholder="Add new subtask" type="text">
    <img class="tsksGen" src="../img/subTaskIcon.svg"></div>`;
}

function resetingGlobalVariable() {
    expanded = false;
    names = [];
    namesInitials = [];
}

function resetingLocalVariables() {
    document.getElementById('customSelect').innerHTML = `Select task category`;
    document.getElementById('allCntcts').style.display = "none";
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    document.getElementById('subTsksBoard').innerHTML = '';
    document.getElementById('selCntcts').innerHTML = '';
}

function resetError() {
    document.getElementById('failName').classList.add("d_none");
    document.getElementById('failDueDate').classList.add("d_none");
    document.getElementById('failCategory').classList.add("d_none");
    document.getElementById('titleText').classList.remove("failedinput");
    document.getElementById('dateData').classList.remove("failedinput");
    document.getElementById('customSelect').classList.remove("failedinput");
}