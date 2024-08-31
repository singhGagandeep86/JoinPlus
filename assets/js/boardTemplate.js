function templateTaskHTML(element) {
    return `<div class="task" draggable="true" ondragstart="startDragging(${element['number']})">
    <div class="taskInfo">
        <span class="bg_${element['color']}">${element['category']}</span>
        <div class="taskTitle">
            <span>${element['title']}</span>
            <span>${element['description']}</span>
        </div>
        <div id="subtask" class="subtaskArea"></div>



    </div>
    </div>`;
}

function templateTaskEmptyTodo() {
    return `<div class="emptyBoardArea"><span>No tasks To do</span></div>`    
}
function templateTaskEmptyInProegress() {
    return `<div class="emptyBoardArea"><span>No tasks to in progress</span></div>`    
}
function templateTaskEmptyAwait() {
    return `<div class="emptyBoardArea"><span>No tasks to await feedback</span></div>`    
}
function templateTaskEmptyDone() {
    return `<div class="emptyBoardArea"><span>No tasks to done</span></div>`    
}