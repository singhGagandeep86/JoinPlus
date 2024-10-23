let token = sessionStorage.getItem('authToken');
let names = [];
let namesInitials = [];
let colours = [];
let array = [];
let expanded = false;
let dropdownOpen = false;
let task = {};


async function init() {
  fetchUrl();
  fetchUserData('/user');
}

function getDatabaseUrl(path) {
  return `${BASE_URL}${path}.json?auth=${token}`;
}

async function fetchUrl() {
  let firebaseUrl = await fetch(BASE_URL + ".json?auth=" + token);
  let firebaseUrlAsJson = await firebaseUrl.json();
  let firebaseData = Object.values(firebaseUrlAsJson);
  contactsData(firebaseData[0]);
}

function contactsData(firebase) {
  let contactsLength = Object.values(firebase);
  let objLngth = contactsLength.length;
  for (let i = 0; i < objLngth; i++) {
    const eachName = contactsLength[i].name;
    array.push(contactsLength[i]);
    if (array[i].name.split(' ')[1]) {
      wthScndName(i, eachName);
    }
    else { wthoutScndName(i, eachName); }
  }
}

function wthScndName(i, eachName) {
  let colour = array[i].color;
  let sanitizedEachName = eachName.replace(/\s+/g, '_');
  let firstName = array[i].name.split(' ')[0].toUpperCase();
  let contact = document.getElementById("allCntcts");
  let lastName = array[i].name.split(' ')[1].toUpperCase();
  let firstNameStart = firstName[0];
  let lastNameStart = lastName[0];
  contact.innerHTML += contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart);
}

function wthoutScndName(i, eachName) {
  let colour = array[i].color;
  let sanitizedEachName = eachName.replace(/\s+/g, '_');
  let firstName = array[i].name.split(' ')[0].toUpperCase();
  let contact = document.getElementById("allCntcts");
  let firstNameStart = firstName[0];
  let lastNameStart = '';
  contact.innerHTML += contactsTemp(sanitizedEachName, colour, eachName, firstNameStart, lastNameStart);
}

function selectionContact(name, colour) {
  const currenID = document.getElementById(name);
  if (currenID.checked == true) {
    pushSelection(currenID, name, colour);
  }
  else {
    spliceSelection(currenID, name);
  }
  if (namesInitials.length > 4) {
    document.getElementById('moreIcon').classList.remove("d_noneImg");
  } else {
    document.getElementById('moreIcon').classList.add("d_noneImg");
  }
  let SelectedContactsBoard = document.getElementById('selCntcts');
  SelectedContactsBoard.innerHTML = '';
  for (let i = 0; i < namesInitials.length; i++) {
    loopForCntcts(i, SelectedContactsBoard);
  }
}

function loopForCntcts(i, SelectedContactsBoard) {
  const namesInitial = namesInitials[i];
  const color = colours[i];
  SelectedContactsBoard.innerHTML += `<div class="namesInitials b-${color}">${namesInitial}</div>`;
}

function pushSelection(currenID, name, colour) {
  currenID.parentElement.style.backgroundColor = "#2A3647";
  currenID.parentElement.style.color = "white";
  currenID.nextElementSibling.style.content = "url(../img/checkButtonSelected.svg)";
  names.push(name);
  const nameArray = name.split('_');
  const firstName = nameArray[0].toUpperCase();
  if (nameArray[1]) {
    clrWthTwoNames(nameArray, firstName, colour);
  }
  else {
    clrWthOneName(firstName, colour);
  }
}

function clrWthTwoNames(nameArray, firstName, colour) {
  const lastName = nameArray[1].toUpperCase();
  let firstNameStart = firstName[0];
  let lastNameStart = lastName[0];
  namesInitials.push(firstNameStart + lastNameStart);
  colours.push(colour);
}

function clrWthOneName(firstName, colour) {
  let firstNameStart = firstName[0];
  let lastNameStart = '';
  namesInitials.push(firstNameStart + lastNameStart);
  colours.push(colour);
}

function spliceSelection(currenID, name) {
  currenID.parentElement.style.backgroundColor = "transparent";
  currenID.parentElement.style.color = "black";
  currenID.nextElementSibling.style.content = "url(../img/CheckbuttonEmpty.png)";
  const currentName = names.indexOf(name);
  names.splice(currentName, 1);
  namesInitials.splice(currentName, 1);
  colours.splice(currentName, 1);
}

function renderSubTask() {
  if (!document.getElementById('inputField')) {
    document.getElementById('inputSubClass').innerHTML = subTaskTemp();
    document.getElementById('inputField').style.backgroundImage = 'none';
  }
}

function resetInput() {
  document.getElementById('inputField').value = '';
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

function addList() {
  let subTaskInput = document.getElementById('inputField').value;
  let subTaskBoard = document.getElementById('subTsksBoard');
  if (subTaskInput) {
    subTaskBoard.innerHTML += generatedList(subTaskInput);
  }
  document.getElementById('inputSubClass').innerHTML = emptyField();
}

function hoverEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.remove('subTaskIcon');
}

function normalEffect(element) {
  let buttons = element.querySelector('.btns');
  buttons.classList.add('subTaskIcon');
}

function editsubTask(element) {
  let parent = element.closest('li');
  let currentValue = parent.querySelector('.leftPart').innerText.trim();
  parent.innerHTML = `<div class="wrapper">
  <input type="text" value="${currentValue}" class="subTaskInput"></input> 
  <div class="btns subTaskIcon subTaskEdit">
  <img class="inputIcon" onclick="delsubTask(this)" src="../img/SubTaskDelete.svg">
  <img class="deleteIcon" onclick="newSubTask(this)" src="../img/SubTaskDone.svg">
</div></div>`;
}
function delsubTask(element) {
  element.closest('li').remove();
}

function newSubTask(element) {
  let parent = element.closest('li');
  let newValue = parent.querySelector('.subTaskInput').value;
  parent.innerHTML = ` <div class="leftPart"><span class="bullet"></span>${newValue}</div>
 <div class="btns subTaskIcon">
 <img onclick="editsubTask(this, '${newValue}')" class="inputIcon" src="../img/SubtasksEdit.svg">
 <img onclick="delsubTask(this)" class="deleteIcon" src="../img/SubtasksDel.svg">
</div>`;
}

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

document.addEventListener('click', function (event) {
  const assign = document.getElementById("assign");
  const allCntcts = document.getElementById("allCntcts");
  if (expanded && !assign.contains(event.target) && !allCntcts.contains(event.target)) {
    allCntcts.style.display = "none";
    document.getElementById('arrow').style.transform = "rotate(0deg)";
    expanded = false;
    document.getElementById("allCntcts").addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
});

function toggleDropdown() {
  const dropdown = document.getElementById('dropdown');
  if (!dropdownOpen) {
    dropdown.classList.remove('selectHide');
    clearFailAddCat();
    dropdownOpen = true;
  } else {
    dropdown.classList.add('selectHide');
    dropdownOpen = false;
  }
}

function selectOption(element) {
  const customSelect = document.getElementById('customSelect');
  const hiddenSelect = document.getElementById('hiddenSelect');
  customSelect.textContent = element.textContent;
  hiddenSelect.value = element.getAttribute('data-value');
  toggleDropdown();
  customSelect.classList.remove('invalid');
}

document.addEventListener('click', function (rightEvent) {
  const assignHeading = document.getElementById('customSelect');
  if (dropdownOpen && !assignHeading.contains(rightEvent.target)) {
    toggleDropdown();
  }
});

function showSelection(element) {
  const select = element.innerHTML;
  document.getElementById('assignHeading').innerHTML = select;
  document.getElementById("slection").classList.add("selectHide");
}

function resetAll() {
  deletArray()
  resetingGlobalVariable();
  resetingLocalVariables();
  resetError();
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

document.addEventListener('DOMContentLoaded', function () {
  let form = document.getElementById('myForm');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addingTask('toDo');
    });
  }
});

async function addingTask(id) {
  if (checkValidation()) {
    document.getElementById('taskDoneIcon').classList.remove("subTaskIcon");
    await toWaiting(id);
    await navigateToBoard();
  }
}

async function toWaiting(id) {
  let titleText = document.getElementById('titleText').value;
  let desText = document.getElementById('desText').value;
  let actDate = document.getElementById('dateData').value;
  let category = document.getElementById('customSelect').innerText;
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
  let category = document.getElementById('customSelect').innerText;
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

function checkValidation() {
  let task = document.getElementById('titleText').value;
  let category = document.getElementById('customSelect').innerText;
  let taskReg = /^[a-zA-Z]+( [a-zA-Z&]+)*$/;
  let dateReg = dateCheck();
  let chkAllFnc = checkAll(task, dateReg, category);
  let chkTskFnc = checkTask(taskReg, task);
  let chkDteFnc = checkDate(dateReg);
  let chkCatFnc = checkCategory(category);
  if (chkAllFnc == false || chkTskFnc == false || chkDteFnc == false || chkCatFnc == false) {
    return false;
  }

  return true;
}

function checkAll(task, dateReg, category) {
  if (!task && dateReg == false && category === `Select task category`) {
    failAll();
    return false;
  }
}

function checkTask(taskReg, task) {
  if (!taskReg.test(task)) {
    failTask();
    return false;
  }
}

function checkDate(dateReg) {
  if (dateReg == false) {
    failDate();
    return false;
  }
}

function checkCategory(category) {
  if (category === `Select task category`) {
    failCategory();
    return false;
  }
}

function dateCheck() {
  let catchedDate = new Date();
  let year = catchedDate.getFullYear();
  let month = catchedDate.getMonth() + 1;
  let day = catchedDate.getDate();
  let enteredDate = document.getElementById('dateData').value;
  let splittedDate = enteredDate.split("-");
  let inputYear = splittedDate[0];
  let inputMonth = splittedDate[1];
  let inputDate = splittedDate[2];
  if (enteredDate) {
    return compareDate(year, month, day, inputYear, inputMonth, inputDate);
  }
  else {
    return false;
  }
}

function compareDate(year, month, day, inputYear, inputMonth, inputDate) {
  if (inputYear > year && inputYear < 10000) {
    return true;
  }
  else {
    if (inputYear == year & inputMonth > month) {
      return true;
    }
    else {
      if (inputYear == year & inputMonth == month & inputDate >= day) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}

function failTask() {
  document.getElementById('failName').classList.remove("selectHide");
  document.getElementById('titleText').classList.add("failedinput");
}

function failDate() {
  document.getElementById('failDueDate').classList.remove("selectHide");
  document.getElementById('dateData').classList.add("failedinput");
}

function failCategory() {
  document.getElementById('failCategory').classList.remove("selectHide");
  document.getElementById('customSelect').classList.add("failedinput");
}

function failAll() {
  document.getElementById('failName').classList.remove("selectHide");
  document.getElementById('failDueDate').classList.remove("selectHide");
  document.getElementById('failCategory').classList.remove("selectHide");
  document.getElementById('titleText').classList.add("failedinput");
  document.getElementById('dateData').classList.add("failedinput");
  document.getElementById('customSelect').classList.add("failedinput");
}

function dateAutoChange() {
  let today = new Date().toISOString().split('T')[0];
  document.getElementById('dateData').setAttribute('min', today);
}

function clearFailAddTask(inputId, errorId) {
  let inputValue = document.getElementById(inputId).value.trim();
  if (inputValue !== '') {
    document.getElementById(errorId).classList.add('selectHide');
    document.getElementById(inputId).classList.remove('failedinput');
  }
}

function clearFailAddCat() {
  document.getElementById('failCategory').classList.add('selectHide');
  document.getElementById('customSelect').classList.remove('failedinput');
}

function scrollOn() {
  console.log(`test`);
  let scrollDiv = document.getElementById('selCntcts');
  scrollDiv.scrollLeft = scrollDiv.scrollWidth;
}