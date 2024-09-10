const BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
const path = "";
const data = {};
let array = [];
let subtask = [];
let contact = [];
let initialenContact = [];
let draggedElement;


Object.keys(subtask).length
async function load() {
    await loadDataContact("/contact");
    await loadData("/task");
}

async function loadData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    let responsetoJason = await response.json();
    let taskArray = Object.values(responsetoJason);
    for (let i = 0; i < taskArray.length; i++) {

        array.push(taskArray[i]);

    }
    taskAdd();

}

async function loadDataContact(path) {
    let response = await fetch(BASE_URL + path + ".json");
    let responsetoJason = await response.json();
    let contactsArray = Object.values(responsetoJason);
    for (let i = 0; i < contactsArray.length; i++) {

        contact.push(contactsArray[i]);
    }
    extrahiereInitialen();
    taskAdd();
}

async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

async function taskAdd() {
    todo();
    inPorgess();
    awaits();
    done();
}

function todo() {
    let toDo = array.filter(e => e['id'] == 'toDo');
    if (toDo.length == 0) {
        document.getElementById('toDo').innerHTML = templateTaskEmptyTodo();
    } else {
        document.getElementById('toDo').innerHTML = '';
        for (let index = 0; index < toDo.length; index++) {
            let element = toDo[index];
            if (element.subtask == null) {
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
            } else {
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                subtaskBar(element);
            }
        }
    }
}

function inPorgess() {
    let inprogress = array.filter(e => e['id'] == 'progress');
    if (inprogress.length == 0) {
        document.getElementById('progress').innerHTML = templateTaskEmptyInProegress();
    } else {
        document.getElementById('progress').innerHTML = '';
        for (let index = 0; index < inprogress.length; index++) {
            let element = inprogress[index];
            if (element.subtask == null) {
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
            } else {
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                subtaskBar(element);
            }
        }
    }
}

function awaits() {
    let await = array.filter(e => e['id'] == 'await');
    if (await.length == 0) {
        document.getElementById('await').innerHTML = templateTaskEmptyAwait();
    } else {
        document.getElementById('await').innerHTML = '';
        for (let index = 0; index < await.length; index++) {
            let element = await[index];
            if (element.subtask == null) {
                document.getElementById('await').innerHTML += templateTaskHTML(element);
            } else {
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                subtaskBar(element);
            }


        }
    }
}

function done() {
    let done = array.filter(e => e['id'] == 'done');
    if (done.length == 0) {
        document.getElementById('done').innerHTML = templateTaskEmptyDone();
    } else {
        document.getElementById('done').innerHTML = '';
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            if (element.subtask == null) {
                document.getElementById('done').innerHTML += templateTaskHTML(element);
            } else {
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                subtaskBar(element);
            }
        }
    }
}

function startDragging(number, element) {
    draggedElement = number;
    element.classList.add('drag');
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(element) {
    array[draggedElement]['id'] = element;
    taskAdd();
}

function openPopUpTask(id) {
    let taskPopUp = document.getElementById('popupTaskMain');
    taskPopUp.classList.remove('d_none');
    taskPopUp.innerHTML = '';
    taskPopUp.innerHTML = templatePopUpTask1();
    let area = document.getElementById('CloseArea');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function closePopUpTask() {
    let button = document.getElementById('btnTaskPopupcloseArea');
    button.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    let taskPopUp = document.getElementById('popupTaskMain');
    taskPopUp.classList.add('d_none');
}

function subtaskBar(element) {
    let rangeId = `subtaskRange-${element['number']}`;
    let range = document.getElementById(rangeId);
    let subtaskCount = Object.keys(element.subtask).length
    if (rangeId == '') {
        document.getElementById('rangeId').classList.add('d_none');
    } else {
        range.innerHTML = templateRange(subtaskCount);
    }
}
function loadContactTask() {
    let taskContact = document.getElementById('contactPic');

    for (let i = 0; i < contact.length; i++) {

        taskContact.innerHTML += templateContact(i);
    }
}

function extrahiereInitialen() {

    for (let i = 0; i < contact.length; i++) {
        let nameParts = contact[i].name.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        initialenContact.push(initials);
    }
}

function openPopUpTaskSmall(i) {
    let info = document.getElementById('popupTaskInfo');
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    info.innerHTML = templateTaskSmallInfo(i);
    time(i);
    addcontactInfo(i);
    let area = document.getElementById('closeAreaInfo');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function closePopUpTaskSmall() {
    document.getElementById('popupTaskInfo').classList.add('d_none');
}

function time(i) {
    let dateArea = document.getElementById('dateAreaInfo');
    let times = array[i].date;
    if (times) {
        let [year, month, day] = times.split('-');
        let formattedDate = `${day}-${month}-${year}`;
        let dateReplace = formattedDate.replace(/-/g, "/");
        dateArea.innerHTML = dateReplace;
    }
}

function addcontactInfo(i) {
    let contacts = document.getElementById('contactAreaInfo');
    contacts.innerHTML = '';
    for (let i = 0; i < contact.length; i++) {
        contacts.innerHTML += templateContactInfo(i);
    }
}
