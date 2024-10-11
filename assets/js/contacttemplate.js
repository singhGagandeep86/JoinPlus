document.getElementById('add-contact-btn').addEventListener('click', function () {
    document.getElementById('overlay').classList.add('show');
});

document.getElementById('cancel-icon').addEventListener('click', function () {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('overlay').addEventListener('click', function (event) {
    if (event.target === document.getElementById('overlay')) {
        document.getElementById('overlay').classList.remove('show');
    }
});


function overlay2(i, initials) {
    return `
                     <div id="EditAreaStop" class="popupEdit">
                         <div class="popupEditLeft">
                             <div class="logoEdit">
                                 <img src="../img/Joinlogowhite.png" alt="Logo">
                             </div>
                             <h2>Edit contact</h2>
                             
                             <img class="strichEdit" src="../img/unterstrichvector.png">
                         </div>
                         <div class="popupEditRight">
                             <div >
                                <span class="contact-ellipse2 b-${array[i].color}">${initials}</span>
                             </div>
                                 
                             <form id="contactFormEdit">
                                 <div class="EditInput">
                                     <div class="input-container"><input id="name2" type="text" placeholder="Name" required></div>
                                     <div class="input-container"><input id="email2" type="email" placeholder="Email" required></div>
                                     <div class="input-container"><input id="phone2" type="tel" placeholder="Phone"></div>
                                 </div>
                                 <div class="popup-actions">
                                     <button onclick="deleteEdit(${i})" type="button" id="cancel-icon" class="cancelbutton">Delete</button>
                                     <button onclick="editContactData(event, ${i})" class="createbuttoncontact" type="submit">Save <img src="../img/checkaddcontact.png"></button>
                                 </div>
                             </form>
                             <div onclick="editContactOff()" class="closeBtnEdit">
                                     <img src="../img/Close.png">
                                 </div>
                         </div>
</div>`}

function loadContactDetails(i, initials, number) {
    return `
        <div class="contact-ellipse">
        <img onclick="showContactList(${i})" class="arrowContact" src="../img/arrow-left-line.png">
            <span class="contact-ellipse2 b-${array[i].color}">${initials}</span>
            <div class="contact-mini">
                <h1>${array[i].name}</h1>
                <div id="editArea" class="editimage">
                    <img onclick="editContact(${i})" class="editimages" src="../img/editcontacts.png">
                    <img onclick="deleteContact(${number})" class="editimages2" src="../img/Deletecontact.png">
                </div>
            </div>
        </div>
        <div class="contact-info">
            <span class="CI-info">Contact Information</span>
            <p><b>Email</b></p>
            <div class="changemycolor">${array[i].email}</div>
            <p><b>Phone</b></p>
            ${array[i].rufnummer || ''}
        </div>

        <button id="editBtn" onclick="editMenuOn()" class="mini-add-contact">
                    <img  src="../img/MenuContactoptions.png">
        </button>

        <div id="editImage2" class="d_none">
        <div  class="editimage2 ">
                    <img onclick="editContact(${i})" class="editimages" src="../img/editcontacts.png">
                    <img onclick="deleteContact(${number})" class="editimages2" src="../img/Deletecontact.png">
                </div>
                </div>
`}

function loadContactData(i, initials) {
    return `<div class="contact-group">
                <div class="contact-item active2" onclick="showContactDetails(${i}, '${initials}')">
                    <div class="avatar"><span class="b-${array[i].color}">${initials}</span></div>
                    <div class="details">
                        <div class="name">${array[i].name}</div>
                        <div class="email changemycolor">${array[i].email}</div>
                    </div>
                </div>
            </div>`;
}