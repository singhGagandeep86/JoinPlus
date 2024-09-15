

let base_Url = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  fetchUrl();
  toggleDropdown();
}

async function fetchUrl() {
  let firebaseUrl = await fetch(base_Url + ".json");
  let firebaseUrlAsJson = await firebaseUrl.json();
  let firebaseData = Object.values(firebaseUrlAsJson);
  contactsData(firebaseData[0]);
}


function contactsData(firebase) {
  let contactsLength = Object.values(firebase);
  let objLngth = contactsLength.length;
  let contact = document.getElementById("checkboxes");
  for (let i = 0; i < objLngth; i++) {
    const eachName = contactsLength[i].name;
    contact.innerHTML += `<label for="${eachName}">
    ${eachName} <input type="checkbox" id="${eachName}"></label>`;
  }
}



function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = ` <div class="smallHead">Subtasks</div>
    <div class="inputWrapper">
    <input id="inputField" class="subtasksTxt" placeholder="Add  new subtask" type="text" onfocus="renderSubTask()">
    <div class="tsksBtns"><img class="inputIcon" src="/assets/img/subTaskCancel.svg" onclick="resetInput()"><img onclick="addList()" class="inputIcon2" src="/assets/img/subTaskEnter.svg"></div>
</div>`;
  }
  document.getElementById('inputField').style.backgroundImage = 'none';
}

function resetInput() {
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = `  <div class="smallHead">Subtasks</div>
  <input class="subtasksTxt" placeholder="Add new subtask" type="text" onfocus="renderSubTask()">`;
}

function addList() {
  let subTaskInput = document.getElementById('inputField').value;
  let subTaskBoard = document.getElementById('subTsksBoard');
  subTaskBoard.innerHTML += `<li onmouseover="hoverEffect(this)" onmouseleave="normalEffect(this)" ondblclick="editsubTask(this)">
  ${subTaskInput} 
  <div class="btns subTaskIcon">
  <img onclick="editsubTask(this, '${subTaskInput}')" class="inputIcon" src="/assets/img/SubtasksEdit.svg">
  <img onclick="delsubTask(this)" class="deleteIcon" src="/assets/img/SubtasksDel.svg">
</div></li>`;
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = `  <div class="smallHead">Subtasks</div>
  <input class="subtasksTxt" placeholder="Add new subtask" type="text" onfocus="renderSubTask()">`;
}

function hoverEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.remove('subTaskIcon');
}


function normalEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.add('subTaskIcon');
}

function editsubTask(element, index) {
  let parent = element.closest('li');
  parent.innerHTML = `<div class="wrapper">
  <input type="text" value="${index}" class="subTaskInput"></input> 
  <div class="btns subTaskIcon subTaskEdit">
  <img class="inputIcon" onclick="delsubTask(this)" src="/assets/img/SubTaskDelete.svg">
  <img class="deleteIcon" onclick="newSubTask(this)" src="/assets/img/SubTaskDone.svg">
</div></div>`;
}

function delsubTask(element) {
  element.closest('li').remove();
}

function newSubTask(element) {
  let parent = element.closest('li');
  let newValue = parent.querySelector('.subTaskInput').value;
  parent.innerHTML = `${newValue} 
 <div class="btns subTaskIcon">
 <img onclick="editsubTask(this, '${newValue}')" class="inputIcon" src="/assets/img/SubtasksEdit.svg">
 <img onclick="delsubTask(this)" class="deleteIcon" src="/assets/img/SubtasksDel.svg">
</div>`;
}

function activateUrgent() {
  document.getElementById('btnUrgnt').classList.add("btnUrgnt");
  document.getElementById('btnMed').classList.remove("btnMed");
  document.getElementById('btnLow').classList.remove("btnLow");
  document.getElementById('btnUrgnt').innerHTML = `<div id="btnUrgnt" onclick="activateUrgent()"class=" btnUrgnt">Urgent <img src="/assets/img/prioUrgentUnselected.svg"></div>`;
  document.getElementById('btnMed').innerHTML = ` <div>Medium <img src="/assets/img/prioMedium.svg"></div>`;
  document.getElementById('btnLow').innerHTML = ` <div>Low <img src="/assets/img/prioLow.svg"></div>`;
}

function activateMedium() {
  document.getElementById('btnMed').classList.add("btnMed");
  document.getElementById('btnUrgnt').classList.remove("btnUrgnt");
  document.getElementById('btnLow').classList.remove("btnLow");
  document.getElementById('btnMed').innerHTML = `<div id="btnMed" onclick="activateMedium()"class=" btnMed">Medium <img src="/assets/img/prioMediumUnselected.svg"></div>`
  document.getElementById('btnUrgnt').innerHTML = ` <div>Urgent <img src="/assets/img/prioUrgent.svg"></div>`;
  document.getElementById('btnLow').innerHTML = ` <div>Low <img src="/assets/img/prioLow.svg"></div>`;
}

function activateLow() {
  document.getElementById('btnLow').classList.add("btnLow");
  document.getElementById('btnUrgnt').classList.remove("btnUrgnt");
  document.getElementById('btnMed').classList.remove("btnMed");
  document.getElementById('btnLow').innerHTML = `<div id="btnLow" onclick="activateLow()"class="btnLow">Low <img src="/assets/img/prioLowUnselected.svg"></div>`
  document.getElementById('btnMed').innerHTML = ` <div>Medium <img src="/assets/img/prioMedium.svg"></div>`;
  document.getElementById('btnUrgnt').innerHTML = ` <div>Urgent <img src="/assets/img/prioUrgent.svg"></div>`;
}


// function for categoru drop down function
function toggleDropdown() {
  const selectedElement = document.querySelector('.select-selected');
  const itemsContainer = document.querySelector('.select-items');

  // Close the dropdown if clicked outside
  document.addEventListener('click', function (e) {
    if (!selectedElement.contains(e.target)) {
      itemsContainer.classList.add('select-hide');
      selectedElement.classList.remove('select-arrow-active');
    }
  });
}

function dropDown(element) {
  const selectedElement = document.querySelector('.select-selected');
  const itemsContainer = document.querySelector('.select-items');
  const items = itemsContainer.querySelectorAll('div');

  document.getElementById('slection').classList.toggle('select-hide');
  element.classList.toggle('select-arrow-active');

  // Handle item selection
  items.forEach(item => {
    item.addEventListener('click', function () {
      selectedElement.innerText = this.innerText;
      selectedElement.setAttribute('data-value', this.getAttribute('data-value'));
      itemsContainer.classList.add('select-hide');
      selectedElement.classList.remove('select-arrow-active');
    });
  });
}
// end of Dropdown

//Drop down function for Assigned Contacts

let expanded = false;

function showCheckBoxes() {
  const checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}


// reseting all
function resetAll() {
  document.getElementById('btnUrgnt').innerHTML = ` <div>Urgent <img src="/assets/img/prioUrgent.svg"></div>`;
  document.getElementById('btnUrgnt').classList.remove("btnUrgnt");
  document.getElementById('btnMed').innerHTML = ` <div>Medium <img src="/assets/img/prioMedium.svg"></div>`;
  document.getElementById('btnMed').classList.remove("btnMed");
  document.getElementById('btnLow').innerHTML = ` <div>Low <img src="/assets/img/prioLow.svg"></div>`;
  document.getElementById('btnLow').classList.remove("btnLow");
  document.querySelector('.select-selected').innerText = `Select task category`;
  document.getElementById('subTsksBoard').innerHTML = '';
}
