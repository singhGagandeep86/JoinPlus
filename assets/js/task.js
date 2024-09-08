

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
  let contact = document.getElementById("contacts");
  for (let i = 0; i < objLngth; i++) {
    const eachName = contactsLength[i].name;

    if (contact.selectedIndex >= 0) {
      const option = document.createElement("option");
      option.text = `${eachName} `;
      const sel = contact.options[contact.selectedIndex + 4];
      contact.add(option, sel);
    }
  }
}


function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = ` <div class="smallHead">Subtasks</div>
    <div class="inputWrapper">
    <input id="inputField" class="subtasksTxt" placeholder="Add  new subtask" type="text" onfocus="renderSubTask()">
    <div class="tsksBtns"><img class="inputIcon" src="/assets/img/subTaskCancel.svg"><img onclick="addList()" class="inputIcon2" src="/assets/img/subTaskEnter.svg"></div>
</div>`;
  }
  document.getElementById('inputField').style.backgroundImage = 'none';
}


function addList() {
  let subTaskInput = document.getElementById('inputField').value;
  let subTaskBoard = document.getElementById('subTsksBoard');
  subTaskBoard.innerHTML += `<li>${subTaskInput}</li>`;
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = `  <div class="smallHead">Subtasks</div>
  <input class="subtasksTxt" placeholder="Add new subtask" type="text" onfocus="renderSubTask()">`;
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



function toggleDropdown() {
  const selectedElement = document.querySelector('.select-selected');
  const itemsContainer = document.querySelector('.select-items');
  const items = itemsContainer.querySelectorAll('div');

  // Close the dropdown if clicked outside
  document.addEventListener('click', function (e) {
    if (!selectedElement.contains(e.target)) {
      itemsContainer.classList.add('select-hide');
      selectedElement.classList.remove('select-arrow-active');
    }
  });
};



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
