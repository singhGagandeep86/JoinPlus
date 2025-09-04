/**
 * Adds an event listener to the "Add Contact" button to show the overlay.
 */

document.getElementById('add-contact-btn').addEventListener('click', function () {
    document.getElementById('overlay').classList.add('show');
});

/**
 * Adds an event listener to a smaller "Add Contact" button to show the overlay.
 */

document.getElementById('addContactSmall').addEventListener('click', function () {
    document.getElementById('overlay').classList.add('show');
});

/**
 * Adds an event listener to the cancel icon to hide the overlay.
 */

document.getElementById('cancel-icon').addEventListener('click', function () {
    document.getElementById('overlay').classList.remove('show');
});

/**
 * Adds an event listener to the close button to reload the contact form.
 */

document.getElementById('close-btn').addEventListener('click', function () {
    reloadAdd();
});

/**
 * Adds an event listener to the overlay to close it when clicked outside of the form.
 * @param {Event} event - The click event.
 */

document.getElementById('overlay').addEventListener('click', function (event) {
    if (event.target === document.getElementById('overlay')) {
        reloadAdd();
    }
});

/**
 * Generates the HTML structure for the edit contact overlay.
 * @param {number} i - The index of the contact.
 * @param {string} initials - The initials of the contact.
 * @returns {string} - The HTML string for the edit overlay.
 */

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
                             <div id="userImgEdit" class="userImgEdit contact-ellipse2 b-${array[i].color}" style="position: relative">
                                 <img id="userProfileImg" class="userImg d_none">
                                 <span id="contactInitials">${initials}</span>
                                 <input id="contactImgPicker" type="file" style="display: none;" accept="image/JPEG, image/PNG">
                                 <div class="camera" onclick="openImgPicker()">
                                     <img src="../img/camera.png">
                                 </div>
                             </div>
                             <form id="contactFormEdit">
                                 <div class="EditInput">
                                     <div class="input-container"><input id="name2" class="input" type="text" placeholder="Name"
                                     oninput="clearFailEdit('name2', 'failNameEdit')">
                                     <div id="failNameEdit" class="fail d_none "><span>Please enter a correct name</span>
                                        </div>
                                     </div>
                                     <div class="input-container"><input id="email2" class="input" type="email" placeholder="Email"
                                     oninput="clearFailEdit('email2', 'failEmailEdit')">
                                     <div id="failEmailEdit" class="fail d_none "><span>Please enter a correct email, example alex@test.de</span></div>
                                     </div>
                                     <div class="input-container"><input id="phone2" class="input" type="tel" placeholder="Phone"
                                     oninput="clearFailEdit('phone2', 'failPhoneEdit')">
                                     <div id="failPhoneEdit" class="fail d_none "><span>Please enter a correct number, just a number.</span></div>
                                     </div>
                                    <div id="failAllEdit" class="fail d_none"><span>Please enter a name, email and phone number.</span></div>
                                 </div>
                                 <div class="popup-actions">
                                     <button onclick="deleteEdit(${i})" type="button" id="cancel-icon" class="deleteBtnEditContact">Delete</button>
                                     <button type="button" onclick="editContactData(${i})" class="createbuttoncontact">Save <img src="../img/checkaddcontact.png"></button>
                                 </div>
                             </form>
                             <div onclick="editContactOff()" class="closeBtnEdit">
                                     <img src="../img/Close.png">
                                 </div>
                         </div>
</div>`}

/**
 * Generates the HTML for displaying detailed contact information.
 * @param {number} i - The index of the contact.
 * @returns {string} - The HTML string for the contact details.
 */

function loadContactDetails(i, number, color) {

    return `
        <div class="contact-ellipse">
        <img onclick="showContactList(${i})" class="arrowContact" src="../img/arrow-left-line.png">
            <div id="contactContainer" class="b-${color} contact-ellipse2">
            </div>
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

function loadContactPic(pic) {
    return `   <img id="contactImg" class="profle-pic" src="${pic}">`
}

function loadContactInitials(initial) {
    return ` <span id="contactInitials">${initial}</span>`
}

/**
 * Generates the HTML for displaying a contact item in the contact list.
 * @returns {string} - The HTML string for a contact item.
 */

function loadContactWithInitials(i, initials) {
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

function loadContactWithPic(i, initials, pic) {
    return `<div class="contact-group">
                <div class="contact-item active2" onclick="showContactDetails(${i}, '${initials}')">
                    <div class="avatar b-${array[i].color}"><img class="profle-pic" src="${pic}"></div>
                    <div class="details">
                        <div class="name">${array[i].name}</div>
                        <div class="email changemycolor">${array[i].email}</div>
                    </div>
                </div>
            </div>`;
}