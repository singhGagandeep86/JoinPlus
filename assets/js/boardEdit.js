// let contactArray =[];
// let path = '';
// let base_Url = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";

// async function fetchUrl() {
//     let firebaseUrl = await fetch(base_Url + path +  ".json");
//     let firebaseUrlAsJson = await firebaseUrl.json();
//     let firebaseData = Object.values(firebaseUrlAsJson);
    
//   }

function editOpen(i) {
    let edit = document.getElementById('popupTaskInfo');
    let prioCheck = arrayLoad[i].prio;
    edit.innerHTML = '';
    document.getElementById('popupTaskInfo').classList.remove('d_none');
    edit.innerHTML = editTask(i);
    descriptionData(i);
    loadSubs(i);
    priorityEditCheck(prioCheck);
    let area = document.getElementById('edit');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}

function loadSubs(i) {
    let subtaskArea = document.getElementById('subTaskBoard');
    let subs = arrayLoad[i].subtask ? Object.values(arrayLoad[i].subtask) : null;
    if (subs == null) {
        subtaskArea.innerHTML = '';
    } else {
        for (let i = 0; i < subs.length; i++) {
            let subTaskData = subs[i];
            subtaskArea.innerHTML += addSubTask(subTaskData);
        }
    }   
}
function descriptionData(i) {
    document.querySelector('.textAreaData').value = arrayLoad[i].description;    
}

function addSubTask(subTaskData) {
    return ` <li>• ${subTaskData} </li>`
}

function priorityEditCheck(prioCheck) {
   let prio = document.getElementsByName('priority');    
    for (let i = 0; i < prio.length; i++) {
        if (prio[i].value === prioCheck) {
            prio[i].checked = true; 
            break; 
        }
    }
}