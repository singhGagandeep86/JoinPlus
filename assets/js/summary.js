let summeryArray = [];

/**
 * Initializes the application by loading and processing necessary data.
 */
async function init() {
    await loadData("/task");
    await fetchAndStoreUID();
    loadAllData();
    await fetchUserData('/user');
}

/**
 * Loads data from the specified path and adds it to the summary array.
 */
async function loadData(path) {
    let token = sessionStorage.getItem('authToken');
    let response = await fetch(BASE_URL + path + ".json?auth=" + token);
    let responsetoJson = await response.json();
    if (responsetoJson === null) {
        await createEmptyTaskNode(path);
    } else {
        let taskArray = Object.values(responsetoJson);
        for (let i = 0; i < taskArray.length; i++) {
            summeryArray.push(taskArray[i]);
        }
    }
}

/**
 * Loads various task data views and updates the greeting.
 */
async function loadAllData() {
    loadTodo();
    loadProgress();
    loadDone();
    loadAwait();
    loadTask();
    loadPrio();
    dateDeadline();
    await addGreating();
}


/**
 * Loads and displays the count of tasks in the "To-Do" state.
 */
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


/**
 * Loads and displays the count of tasks in the "In-Progress" state.
 */
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


/**
 * Loads and displays the count of tasks in the "Done" state.
 */
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


/**
 * Loads and displays the count of tasks in the "Awaiting Feedback" state.
 * tasks currently awaiting feedback. If there are no tasks in this state,
 * it displays 0.
 */
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


/**
 * Loads and displays the total count of all tasks, including those in the "toDo", "In-Progress", "Awaiting Feedback", and "Done" states.
 */
function loadTask() {
    let tasks = document.getElementById('taskAll');
    tasks.innerHTML = '';
    if (summeryArray == null) {
        tasks.innerHTML = 0;
    } else {
        tasks.innerHTML = summeryArray.length;
    }
}


/**
 * Loads and displays the count of tasks with the "urgent" priority in the summary bar.
 * If there are no tasks with this priority, it displays 0.
 */
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


/**
 * Updates the displayed deadline date in the summary bar.
 * It takes the latest deadline date from the summeryArray and displays it in the "date" element.
 */
function dateDeadline() {
    let date = document.getElementById('date');
    let dateData = summeryArray.map(e => new Date(e.date));
    let latestDate = new Date(Math.max(...dateData.map(date => date.getTime())));
    let latesDateChange = formatDate(latestDate);
    date.innerHTML = '';
    date.innerHTML = latesDateChange;
}

/**
 * Formats a date object into a readable string.
 */
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

/**
 * Redirects the user to the 'board' page.
 */
function goToBoard() {
    window.location.href = 'board.html';
}

/**
 * Determines the greeting based on the current time of day.
 */
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

/**
 * Adds a greeting message to the page.
 */
function addGreating() {
    let greatingArea = document.getElementById('greatingDay');
    let greeting = loadGreeting();
    greatingArea.innerHTML = ''
    greatingArea.innerHTML = `<span>${greeting}</span>, <span id="greetingName"></span>`;
}

/**
 * Fetches and stores the user's UID in session storage if not already present.
 */
function fetchAndStoreUID() {
    let token = sessionStorage.getItem('authToken');
    if (!sessionStorage.getItem('uid')) {
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
                let uid = data.users[0].localId;
                sessionStorage.setItem('uid', uid);
            });
    }
}

