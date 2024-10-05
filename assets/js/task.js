
let base_Url = `https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/`;
let token = sessionStorage.getItem('authToken');
let names = [];
let namesInitials = [];
let colours = [];
let array = [];
let expanded = false;
let subTaskexpanded = false;
let task = {};


async function init() {
  fetchUrl();
}

function getDatabaseUrl(path) {  
  return `${base_Url}${path}.json?auth=${token}`; // URL für die Datenbank zurückgeben
}

// fetch basicData from firebase
async function fetchUrl() {  
  let firebaseUrl = await fetch(base_Url + ".json?auth=" + token);
  let firebaseUrlAsJson = await firebaseUrl.json();
  let firebaseData = Object.values(firebaseUrlAsJson);
  contactsData(firebaseData[0]);
}

// processing contacts after fetch
function contactsData(firebase) {
  let contactsLength = Object.values(firebase);
  let objLngth = contactsLength.length;
  let contact = document.getElementById("allCntcts");
  for (let i = 0; i < objLngth; i++) {
    const eachName = contactsLength[i].name;
    array.push(contactsLength[i]);
    let colour = array[i].color;
    const sanitizedEachName = eachName.replace(/\s+/g, '_');
    const firstName = array[i].name.split(' ')[0].toUpperCase();
    const lastName = array[i].name.split(' ')[1].toUpperCase();
    const firstNameStart = firstName[0];
    const lastNameStart = lastName[0];
    contact.innerHTML += contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart);
  }
}

// updating arrays
function selectionContact(name, colour) {
  const currenID = document.getElementById(name);
  if (currenID.checked == true) {
    pushSelection(currenID, name, colour);
  }
  else {
    spliceSelection(currenID, name);
  }
  let SelectedContactsBoard = document.getElementById('selCntcts');
  SelectedContactsBoard.innerHTML = '';
  for (let i = 0; i < namesInitials.length; i++) {
    const namesInitial = namesInitials[i];
    const color = colours[i];
    SelectedContactsBoard.innerHTML += `<div class="namesInitials b-${color}">${namesInitial}</div>`;
  }
}

// pushing selections into arrays
function pushSelection(currenID, name, colour) {
  currenID.parentElement.style.backgroundColor = "#2A3647";
  currenID.parentElement.style.color = "white";
  currenID.nextElementSibling.style.content = "url(../img/checkButtonSelected.svg)";
  names.push(name);
  const nameArray = name.split('_');
  const firstName = nameArray[0].toUpperCase();
  const lastName = nameArray[1].toUpperCase();
  let firstNameStart = firstName[0];
  let lastNameStart = lastName[0];
  namesInitials.push(firstNameStart + lastNameStart);
  colours.push(colour);
}

// removing selectins from arrays
function spliceSelection(currenID, name) {
  currenID.parentElement.style.backgroundColor = "transparent";
  currenID.parentElement.style.color = "black";
  currenID.nextElementSibling.style.content = "url(../img/CheckbuttonEmpty.png)";
  const currentName = names.indexOf(name);
  names.splice(currentName, 1);
  namesInitials.splice(currentName, 1);
  colours.splice(currentName, 1);
}

// initialising subTasks
function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = subTaskTemp();
    document.getElementById('inputField').style.backgroundImage = 'none';
  }
}

// reseting input when nothing is entered
function resetInput() {
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

// adding input value into lists
function addList() {
  let subTaskInput = document.getElementById('inputField').value;
  let subTaskBoard = document.getElementById('subTsksBoard');
  if (subTaskInput) {
    subTaskBoard.innerHTML += generatedList(subTaskInput);
  }
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

// revealing buttons when hovered
function hoverEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.remove('subTaskIcon');
}

// hiding effects when away
function normalEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.add('subTaskIcon');
}

// editing added subtask
function editsubTask(element) {
  let parent = element.closest('li');
  let currentValue = parent.querySelector('.leftPart').innerText.trim();
  parent.innerHTML = `<div class="wrapper">
  <input type="text" value="${currentValue}" class="subTaskInput"></input> 
  <div class="btns subTaskIcon subTaskEdit">
  <img class="inputIcon" onclick="delsubTask(this)" src="/assets/img/SubTaskDelete.svg">
  <img class="deleteIcon" onclick="newSubTask(this)" src="/assets/img/SubTaskDone.svg">
</div></div>`;
}

// removing subtask
function delsubTask(element) {
  element.closest('li').remove();
}

// subtask renewing 
function newSubTask(element) {
  let parent = element.closest('li');
  let newValue = parent.querySelector('.subTaskInput').value;
  parent.innerHTML = ` <div class="leftPart"><span class="bullet"></span>${newValue}</div>
 <div class="btns subTaskIcon">
 <img onclick="editsubTask(this, '${newValue}')" class="inputIcon" src="/assets/img/SubtasksEdit.svg">
 <img onclick="delsubTask(this)" class="deleteIcon" src="/assets/img/SubtasksDel.svg">
</div>`;
}

// Drop down function for Assigned Contacts
function showCheckBoxes() {
  const allCntcts = document.getElementById("allCntcts");
  if (!expanded) {
    document.getElementById('arrow').style.transform = "rotate(-180deg)";
    allCntcts.style.display = "block";
    expanded = true;
  } else {
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    allCntcts.style.display = "none";
    expanded = false;
  }
}

// Event-Listener für Klick außerhalb der "Assigned Contacts"-Dropdown
document.addEventListener('click', function (event) {
  const assign = document.getElementById("assign");
  const allCntcts = document.getElementById("allCntcts");
  if (expanded && !assign.contains(event.target)) {
    allCntcts.style.display = "none";
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    expanded = false;
    document.getElementById("allCntcts").addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

});

// Drop down function for category
function showCategory() {
  const select = document.getElementById("slection");
  let arrow = document.getElementById('arrowRight');
  if (!subTaskexpanded) {
    select.classList.remove("selectHide");
    arrow.style.transform = "rotate(-180deg)";
    subTaskexpanded = true;
  }
  else {
    arrow.style.transform = "rotate(0deg)";
    select.classList.add("selectHide");
    subTaskexpanded = false;
  }
}

// Event-Listener für Klick außerhalb der "Category"-Dropdown
document.addEventListener('click', function (rightEvent) {
  const assignHeading = document.getElementById('assignHeading');
  const selection = document.getElementById('slection');
  const arrowRight = document.getElementById("arrowRight");
  if (subTaskexpanded && !assignHeading.contains(rightEvent.target) && !arrowRight.contains(rightEvent.target)) {
    selection.classList.add("selectHide");
    arrowRight.style.transform = "rotate(0deg)";
    subTaskexpanded = false;
  }
});

// showing selected Subtask
function showSelection(element) {
  const select = element.innerHTML;
  document.getElementById('assignHeading').innerHTML = `${select}<img class="arrow" id="arrowRight" src="../img/dropArrow.svg">`;
  document.getElementById("slection").classList.add("selectHide");
}

// reseting all
function resetAll() {
  deletArray()
  resetingGlobalVariable();
  resetingLocalVariables();
  let allContacts = document.getElementById('allCntcts');
  let allLabels = allContacts.getElementsByTagName('label');
  for (i = 0; i < allLabels.length; i++) {
    let label = allLabels[i];
    let chkBox = label.querySelector('span');
    label.style.backgroundColor = "transparent";
    label.style.color = "black";
    chkBox.style.content = "url(../img/CheckbuttonEmpty.png)";
  }

}

function deletArray() {
  names = [];
  namesInitials = [];
  colours = [];
  array = [];
}

// event for onSubmit button
document.addEventListener('DOMContentLoaded', function () {
  let form = document.getElementById('myForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addingTask('toDo');
    });
  }
});

// popup show
async function addingTask(id) {
  document.getElementById('taskDoneIcon').classList.remove("d_noneImg");
  await toWaiting(id);
  await navigateToBoard();
}

// dies ist der breich für add der Task in Firebase

//collect all Datas & added to Firebase
async function toWaiting(id) {
  let titleText = document.getElementById('titleText').value;
  let desText = document.getElementById('desText').value;
  let actDate = document.getElementById('dateData').value;
  let category = document.getElementById('assignHeading').innerText;
  let priority = document.querySelector('input[name="priority"]:checked').value;
  let list = subTsksBoard.getElementsByTagName("li");
  let newTaskNumber = generateRandomNumber();
  let name = createContactFire();
  let checked = checkedCreate(list);
  let subtask = subtastCreate(list);
  let color = colorFirebase();
  pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id);
  return new Promise(resolve => setTimeout(resolve, 1700));
}

async function navigateToBoard() {
  window.location.href = 'board.html';
}

function categoryColourGen() {
  let category = document.getElementById('assignHeading').innerText;
  return category.slice(0, 4);
}

async function postTask(path = "", data = {}) {
  let firebaseUrl = await fetch(getDatabaseUrl(path), {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
}

function pushFirebaseData(titleText, desText, actDate, category, newTaskNumber, name, checked, priority, color, subtask, id) {
  postTask(`/task/task${newTaskNumber}`, {
    'category': category,
    'color': categoryColourGen(),
    'contact': name,
    'contactcolor': color,
    'date': actDate,
    'description': desText,
    'id': id,
    'number': newTaskNumber,
    'prio': priority,
    'subtask': subtask,
    'title': titleText,
    'checked': checked
  });

}
function subtastCreate(list) {
  let subtask = {};
  for (let i = 0; i < list.length; i++) {
    let eachList = list[i];
    let listText = eachList.innerText;
    subtask[`task${i + 1}`] = listText;
  }
  return subtask
}

function checkedCreate(list) {
  let checked = {};
  for (let i = 0; i < list.length; i++) {
    checked[`task${i + 1}`] = false;
  }

  return checked;
}
function createContactFire() {
  let contacts = {};
  for (let j = 0; j < names.length; j++) {
    let name = names[j];
    let sanitizedName = name.replace(/_/g, ' ');
    contacts[`contact${j + 1}`] = sanitizedName;
  }
  return contacts;
}
function colorFirebase() {
  let coloursAsObject = {};
  for (let k = 0; k < colours.length; k++) {
    let colour = colours[k];
    coloursAsObject[`color${k + 1}`] = colour;
  }
  return coloursAsObject;
}

function generateRandomNumber() {
  let number = '';
  for (let i = 0; i < 6; i++) {
    let digit;
    do {
      digit = Math.floor(Math.random() * 10);
    } while (digit === 0);
    number += digit;
  }
  return number;
}