

let base_Url = "https://join-3edee-default-rtdb.europe-west1.firebasedatabase.app/";



function init() {
  fetchUrl();
  dropdown();
}

async function fetchUrl() {
  console.log(`test`);
  let firebaseUrl = await fetch(base_Url + ".json");
  let firebaseUrlAsJson = await firebaseUrl.json();
  console.log(firebaseUrlAsJson);
  contactsData(firebaseUrlAsJson);
}


function contactsData(firebase) {
  let name = firebase.contact.contact.name;
  let contactsLength = firebase.contact;
  let objLngth = Object.keys(contactsLength).length;
  console.log(objLngth);
  console.log(contactsLength);
  console.log(name);
  let contact = document.getElementById("contacts");
  //for (let i = 2; i < objLngth; i++) {
  const eachName = contactsLength.contact`${2}`.name;
  console.log(eachName);
  // }  
  if (contact.selectedIndex >= 0) {
    const option = document.createElement("option");
    option.text = `${name} `;
    const sel = contact.options[contact.selectedIndex + 4];
    contact.add(option, sel);
  }
}


function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = ` <div class="smallHead">Subtasks</div>
    <div class="inputWrapper">
    <input id="inputField" class="subtasksTxt" placeholder="Add  new subtask" type="text" onfocus="renderSubTask()">
    <img class="inputIcon" src="/assets/img/subTaskCancel.svg"><img class="inputIcon2" src="/assets/img/subTaskEnter.svg">
</div>`;
  }
  document.getElementById('inputField').style.backgroundImage = 'none';
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



function dropdown() {
  const selectedElement = document.querySelector('.select-selected');
  const itemsContainer = document.querySelector('.select-items');
  const items = itemsContainer.querySelectorAll('div');

  // Toggle the dropdown when clicking on the selected element
  selectedElement.addEventListener('click', function () {
    itemsContainer.classList.toggle('select-hide');
    this.classList.toggle('select-arrow-active');
  });

  // Handle item selection
  items.forEach(item => {
    item.addEventListener('click', function () {
      selectedElement.innerText = this.innerText;
      selectedElement.setAttribute('data-value', this.getAttribute('data-value'));
      itemsContainer.classList.add('select-hide');
      selectedElement.classList.remove('select-arrow-active');
    });
  });
  // Close the dropdown if clicked outside
  document.addEventListener('click', function (e) {
    if (!selectedElement.contains(e.target)) {
      itemsContainer.classList.add('select-hide');
      selectedElement.classList.remove('select-arrow-active');
    }
  });
};
