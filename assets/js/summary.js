let summeryArray = [];
let BASE_URL = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";


async function init() {
    await loadData("/task");
    loadAllData()
}
function fetchUserUID() {
    let token = sessionStorage.getItem('authToken');
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB28SxWSMdl9k7GYO9zeiap6u3DauBUhgM`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            idToken: token
        })
    })
    .then(response => response.json())
    .then(data => {
        let uid = data.users[0].localId; // UID des Benutzers
        console.log("UID:", uid);
        // Hier kannst du mit dem UID weiterarbeiten
    });
}

async function loadData(path) {
    // Token aus dem sessionStorage holen
    let token = sessionStorage.getItem('authToken');
    if (!token) {
        console.error("Kein Token gefunden. Zugriff verweigert.");
        return;
    }

    let response = await fetch(BASE_URL + path + ".json?auth=" + token); // Token in die URL einfügen
    let responsetoJson = await response.json();
    if (responsetoJson === null) {
        await createEmptyTaskNode(path); // Funktion zum Erstellen eines leeren Knotens
    } else {
        let taskArray = Object.values(responsetoJson);
        for (let i = 0; i < taskArray.length; i++) {
            summeryArray.push(taskArray[i]); // Aufgaben zu summeryArray hinzufügen
        }
    }
}
function loadAllData() {
    loadTodo();
    loadProgress();
    loadDone();
    loadAwait();
    loadTask();
    loadPrio();
    dateDeadline();
    addGreating();
}

function loadTodo() {
    let todo = document.getElementById('todo');
    todo.innerHTML = '';
    let todos = summeryArray.filter(e => e['id'] == 'toDo');
    if (todos == null) {
        todo.innerHTML = 0;
    } else {
        todo.innerHTML = todos.length;
    }
}

function loadProgress() {
    let progress = document.getElementById('progress');
    progress.innerHTML = '';
    let inprogress = summeryArray.filter(e => e['id'] == 'progress');
    if (inprogress == null) {
        progress.innerHTML = 0;
    } else {
        progress.innerHTML = inprogress.length;
    }
}

function loadDone() {
    let dones = document.getElementById('done');
    dones.innerHTML = '';
    let done = summeryArray.filter(e => e['id'] == 'done');
    if (done == null) {
        dones.innerHTML = 0;
    } else {
        dones.innerHTML = done.length;
    }
}

function loadAwait() {
    let awaits = document.getElementById('await');
    awaits.innerHTML = '';
    let await = summeryArray.filter(e => e['id'] == 'await');
    if (await == null) {
        awaits.innerHTML = 0;
    } else {
        awaits.innerHTML = await.length;
    }
}

function loadTask() {
    let tasks = document.getElementById('taskAll');
    tasks.innerHTML = '';
    if (summeryArray == null) {
        tasks.innerHTML = 0;
    } else {
        tasks.innerHTML = summeryArray.length;
    }
}

function loadPrio() {
    let prio = document.getElementById('urgent');
    prio.innerHTML = '';
    let prios = summeryArray.filter(e => e['prio'] == 'urgent');
    if (prios == null) {
        prio.innerHTML = 0;
    } else {
        prio.innerHTML = prios.length;
    }
}

function dateDeadline() {
    let date = document.getElementById('date');
    let dateData = summeryArray.map(e => new Date(e.date));
    let latestDate = new Date(Math.max(...dateData.map(date => date.getTime())));
    let latesDateChange = formatDate(latestDate);
    date.innerHTML = '';
    date.innerHTML = latesDateChange;
}

function formatDate(date) {
    let months = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    let month = months[date.getMonth()];
    let day = date.getDate();
    let year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

function goToBoard() {
    window.location.href = 'board.html';
}

function loadGreeting() {
    let options = { timeZone: 'Europe/Berlin', hour: 'numeric', minute: 'numeric' };
    let currentTime = new Intl.DateTimeFormat('de-DE', options).format(new Date());
    let [hours, minutes] = currentTime.split(':').map(num => parseInt(num, 10));
    let greeting;
    if (hours < 12) {
        greeting = "Good morning";
    } else if (hours < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }
    return greeting;
}

function addGreating() {
    let greatingArea = document.getElementById('greatingDay');
    let greeting = loadGreeting();
    greatingArea.innerHTML=''
    greatingArea.innerHTML= `<span>${greeting}</span>, <span>Alexander Winkler</span>`;

}