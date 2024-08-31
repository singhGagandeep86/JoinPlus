const BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";
const path = "";
const data = {};
let array = [];
let draggedElement;



function load() {
    // postData("/task",{"name":"name"})
    loadData("/task");
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

async function postData(path, data) {
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function taskAdd() {
    todo();
    inPorgess();
    await();
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
            document.getElementById('toDo').innerHTML += templateTaskHTML(element);
        }
    }
}

function inPorgess() {
    let inPorgess = array.filter(e => e['id'] == 'inPorgess');
    if (inPorgess.length == 0) {
        document.getElementById('inProgress').innerHTML = templateTaskEmptyInProegress();
    } else {
        document.getElementById('inProgess').innerHTML = '';
        for (let index = 0; index < inPorgess.length; index++) {
            let element = inPorgess[index];
            document.getElementById('inProgess').innerHTML += templateTaskHTML(element);
        }
    }

}
function await() {
    let await = array.filter(e => e['id'] == 'await');
    if (await.length == 0) {
        document.getElementById('await').innerHTML = templateTaskEmptyAwait();
    } else {
        document.getElementById('await').innerHTML = '';
        for (let index = 0; index < await.length; index++) {
            let element = await[index];
            document.getElementById('await').innerHTML += templateTaskHTML(element);
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
            document.getElementById('done').innerHTML += templateTaskHTML(element);
        }
    }
}

function startDragging(number) {
    draggedElement = number;    
}
function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(element) {
    array[draggedElement]['id'] = element;
    taskAdd();
}
