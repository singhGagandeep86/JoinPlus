/**
 * Loads contact data based on the provided object data.
 */
function loadContact(objData) {
    fetchContact("/contact", objData)
}

/**
 * Fetches contact data from the specified Firebase path and loads it.
 */
async function fetchContact(pathC, objData) {
    let firebaseUrl = await fetch(BASE_URL + pathC + ".json?auth=" + token);
    let firebaseUrlAsJson = await firebaseUrl.json();
    let firebaseData = Object.values(firebaseUrlAsJson); 
    loadContactData(firebaseData, objData)
}

/**
 * Sends a PATCH request to update data at the specified path.
 */
async function postEditData(path = "", data = {}) { 
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    loadnewTaskEdit();
}

async function deleteUser(path = "") { 
    let firebaseUrl = await fetch(getDatabaseUrl(path), {
        method: "DELETE"
    });
}

/**
 * Sends edited task data to the server.
 */
function pushDataEdit(title, description, dueDate, subtaskobj, checked, contactName, color, contacts, numberEditElement, priority, category, contactColor, attachments) {
    postEditData(`/task/task${numberEditElement}`, {
        'contact': contacts,
        'color': color,
        'date': dueDate,
        'description': description,
        'prio': priority,
        'category': category,
        'contactcolor': contactColor,
        'title': title,
        'subtask': subtaskobj,
        'checked': checked,
        'attachments': attachments
    });
}

/**
 * Creates an empty task node in the database at the specified path.
 */
async function createEmptyTaskNode(path) {
    let task = "";
    await fetch(getDatabaseUrl(path), {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task)
    });
}

/**
 * Deletes a task from the database based on the provided element identifier.
 */
async function deleteData(element) {
    let path = `/task/task${element}`;
    let url = getDatabaseUrl(path);
    let response = await fetch(url, {
        method: 'DELETE',
    });
    closePopUpTaskSmall();
    arrayLoad = [];
    loadData("/task");
}