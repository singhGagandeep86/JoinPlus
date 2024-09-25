let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
let path = "";
let data = {};
let url = '';
let arrayLoad = [];
let searchArray = [];
let draggedElement;
let mediaQuery = window.matchMedia("(max-width: 1100px)");
let toggle = 0;

async function load() {
    await loadData("/task");
}

async function loadData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    let responsetoJason = await response.json();
    let taskArray = Object.values(responsetoJason);
    for (let i = 0; i < taskArray.length; i++) {
        arrayLoad.push(taskArray[i]);
    }

    taskAdd();
}

async function taskAdd() {
    todo();
    inPorgess();
    awaits();
    done();

}

function todo() {
    let toDo = arrayLoad.filter(e => e['id'] == 'toDo');
    if (toDo.length == 0) {
        document.getElementById('toDo').innerHTML = templateTaskEmptyTodo();
    } else {
        document.getElementById('toDo').innerHTML = '';
        for (let index = 0; index < toDo.length; index++) {
            let element = toDo[index];
            let contacts = element.contactcolor ? Object.values(toDo[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(toDo[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);

            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('toDo').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

function inPorgess() {
    let inprogress = arrayLoad.filter(e => e['id'] == 'progress');
    if (inprogress.length == 0) {
        document.getElementById('progress').innerHTML = templateTaskEmptyInProegress();
    } else {
        document.getElementById('progress').innerHTML = '';
        for (let index = 0; index < inprogress.length; index++) {
            let element = inprogress[index];
            let contacts = element.contactcolor ? Object.values(inprogress[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(inprogress[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('progress').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }
        }
    }
}

function awaits() {
    let await = arrayLoad.filter(e => e['id'] == 'await');
    if (await.length == 0) {
        document.getElementById('await').innerHTML = templateTaskEmptyAwait();
    } else {
        document.getElementById('await').innerHTML = '';
        for (let index = 0; index < await.length; index++) {
            let element = await[index];
            let contacts = element.contactcolor ? Object.values(await[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(await[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('await').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            }


        }
    }
}

function done() {
    let done = arrayLoad.filter(e => e['id'] == 'done');
    if (done.length == 0) {
        document.getElementById('done').innerHTML = templateTaskEmptyDone();
    } else {
        document.getElementById('done').innerHTML = '';
        for (let index = 0; index < done.length; index++) {
            let element = done[index];
            let contacts = element.contactcolor ? Object.values(done[index].contactcolor) : null;
            let contactName = element.contact ? Object.values(done[index].contact) : null;
            let checkBoxObject = element.checked ? Object.values(element.checked) : null;
            if (element.subtask == null) {
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                loadContactTask(element, contacts, contactName);
            } else if (checkBoxObject == null && contacts == null) {
                let checkedCount = 0;
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
            } else {
                let checkedCount = checkBoxObject.filter(e => e === true).length;
                document.getElementById('done').innerHTML += templateTaskHTML(element);
                subtaskBar(element, checkedCount);
                loadContactTask(element, contacts, contactName);
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

function openPopUpTask(id) {
    
    let taskPopUp = document.getElementById('popupTaskMain');
    init()
    if (handleMediaChange(mediaQuery)) {
        window.location.href = 'task.html';
    } else {
        taskPopUp.classList.remove('d_none');
        taskPopUp.innerHTML = '';
        taskPopUp.innerHTML = templatePopUpTask1();
        let area = document.getElementById('CloseArea');
        area.addEventListener('click', (event) => {
            event.stopPropagation()
        })
    }

}
function handleMediaChange(e) {
    if (e.matches) {
        window.location.href = 'task.html';
    }
}


function closePopUpTask() {
    resetAll();
    let button = document.getElementById('btnTaskPopupcloseArea');
    button.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    let taskPopUp = document.getElementById('popupTaskMain');
    taskPopUp.classList.add('d_none');
}

function subtaskBar(element, checkedCount) {
    let rangeId = `subtaskRange-${element['number']}`;
    let range = document.getElementById(rangeId);
    let subtaskCount = Object.keys(element.subtask).length
    range.innerHTML = templateRange(subtaskCount, checkedCount);

}
function loadContactTask(element, contacts, contactName) {
    let contactpic = `contact-${element['number']}`
    let taskContact = document.getElementById(contactpic);
    let color = contacts;
    if (color == null && contactName == null) {
        taskContact.innerHTML = '';
    } else {
        for (let i = 0; i < color.length; i++) {
            let colors = color[i];
            let initials = extrahiereInitialen(contactName[i]);
            taskContact.innerHTML += templateContact(colors, initials, i);
        }
    }
}

function extrahiereInitialen(contactName) {
    for (let i = 0; i < contactName.length; i++) {
        let nameParts = contactName.split(' ');
        let initials = '';
        for (let j = 0; j < nameParts.length; j++) {
            initials += nameParts[j].charAt(0).toUpperCase();
        }
        return initials;
    }
}

function openPopUpTaskSmall(i) {
    let info = document.getElementById('popupTaskInfo');
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    info.innerHTML = templateTaskSmallInfo(i);
    time(i);
    addcontactInfo(i);
    addSubtaskInfo(i);
    let area = document.getElementById('closeAreaInfo');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function closePopUpTaskSmall() {
    document.getElementById('popupTaskInfo').classList.add('d_none');
}

function openPopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    let arrow = document.getElementById('arrowSwitch' + element);
    let id = arrayLoad[element].id;
    if (toggle === 0) {
        select.classList.remove('d_none');
        arrow.classList.add('arrowTaskImg');
        select.innerHTML = dataSwitch(id, element);
        toggle = 1;
    } else if (toggle === 1) {
        closePopUpTaskSwitch(element);
        arrow.classList.remove('arrowTaskImg');
        toggle = 0;
    }
    let area = document.getElementById('popupTaskSwitch' + element);
    area.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}

function closePopUpTaskSwitch(element) {
    let select = document.getElementById('popupTaskSwitch' + element);
    select.classList.add('d_none');
}
function dataSwitch(id, element) {
    if ('toDo' == id) {
        return moveTaskTo1(element);
    } else if ('progress' == id) {
        return moveTaskTo2(element);
    } else if ('await' == id) {
        return moveTaskTo3(element);
    } else {
        return moveTaskTo4(element);
    }
}

async function changeIdTaskValue(value, element) {
    let arrow = document.getElementById('arrowSwitch' + element);
    await changeIdTask(value, element);
    arrayLoad = [];
    closePopUpTaskSwitch(element);
    arrow.classList.remove('arrowTaskImg');
    await loadData("/task");



}
async function changeIdTask(value, element) {
    let path = `/task/task${element + 1}`;
    let url = `https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app${path}.json`;
    let idChange = { id: value };
    await postDataId(url, idChange);
}

function time(i) {
    let dateArea = document.getElementById('dateAreaInfo');
    let times = arrayLoad[i].date;
    if (times) {
        let [year, month, day] = times.split('-');
        let formattedDate = `${day}-${month}-${year}`;
        let dateReplace = formattedDate.replace(/-/g, "/");
        dateArea.innerHTML = dateReplace;
    }
}

function addcontactInfo(i) {
    let contactArea = document.getElementById('contactAreaInfo');
    let contactName = arrayLoad[i].contact ? Object.values(arrayLoad[i].contact) : null;
    let contactscolor = arrayLoad[i].contactcolor ? Object.values(arrayLoad[i].contactcolor) : null;
    contactArea.innerHTML = '';
    if (contactName == null) {
        contactArea.innerHTML = '';
    } else {
        for (let i = 0; i < contactName.length; i++) {

            let initials = extrahiereInitialen(contactName[i])
            contactArea.innerHTML += templateContactInfo(contactscolor[i], initials, contactName[i]);
        }
    }

}

function addSubtaskInfo(i) {
    let subtaskInput = document.getElementById('subtaskArea');
    subtaskInput.innerHTML = '';
    if (!arrayLoad[i].subtask) {
        subtaskInput.innerHTML = ''; // 
    } else if (Object.values(arrayLoad[i].subtask).length === 0 && Object.values(arrayLoad[i].checked) === 0) {
        subtaskInput.innerHTML = '';
    } else {
        let subtaskTitle = Object.values(arrayLoad[i].subtask);
        let subtastChecked = Object.values(arrayLoad[i].checked);
        for (let j = 0; j < subtaskTitle.length; j++) {
            let element = subtaskTitle[j];
            subtaskInput.innerHTML += templateSubtask(element, i, j);
            checked(subtastChecked);
        }
    }

}
function moveTo(element) {
    arrayLoad[draggedElement]['id'] = element;
    let changeId = arrayLoad[draggedElement];
    taskAdd();
    postId(element, changeId);

}
async function postId(element, changeId) {
    let number = changeId.number;
    let path = `/task/task${number + 1}`;
    let url = `https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app${path}.json`;
    let idChange = { id: element };
    await postDataId(url, idChange);
}

async function postDataId(url, data) {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}
async function inputCheckBoxInfo(i, j) {
    let checkboxId = `checkbox-${i}-${j}`;
    let checkbox = document.getElementById(checkboxId);
    let path = `/task/task${i + 1}/checked`;
    let url = `https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/${path}.json`;
    let upData = { [`task${j + 1}`]: checkbox.checked };
    await postDataCheck(url, upData);
    arrayLoad = [];
    load();
}

async function postDataCheck(url, data) {
    let response = await fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function checked(subtastChecked) {
    let checkboxes = document.getElementsByName('subtask');
    for (let i = 0; i < subtastChecked.length && i < checkboxes.length; i++) {
        checkboxes[i].checked = subtastChecked[i];
    }
}

function search() {
    let inputSearch = document.getElementById('search');
    let searchArray = arrayLoad.filter(item =>
        item['title'].toLowerCase().includes(inputSearch.value.toLowerCase()) ||
        item['description'].toLowerCase().includes(inputSearch.value.toLowerCase())
    );
    searchStart(inputSearch, searchArray);
}

function searchStart(inputSearch, searchArray) {
    if (searchArray == '') {
        document.getElementById('emptySearchOn').classList.remove('d_none');
    } else if (inputSearch.value.length < 3 && inputSearch.value == 0) {
        document.getElementById('emptySearchOn').classList.add('d_none');
        arrayLoad = [];
        load();
    } else if ((inputSearch.value.length > 2)) {
        document.getElementById('emptySearchOn').classList.add('d_none');
        arrayLoad = searchArray;
        taskAdd();
    }
}
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');

}
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}