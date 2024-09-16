document.getElementById('add-contact-btn').addEventListener('click', function() {
    document.getElementById('overlay').classList.add('show');
});

document.getElementById('cancel-icon').addEventListener('click', function() {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('overlay').addEventListener('click', function(event) {
    if (event.target === document.getElementById('overlay')) {
        document.getElementById('overlay').classList.remove('show');
    }
});

// function loadContactDataa() {
//     let loadDoppleData = `
//     <div class="contact-info">
//                 <h1>${name}</h1>
//                 <div class="contact-info-images">
//                     <img class="editimages" src="/assets/img/edit contacts.png">
//                     <img class="editimages editimages2" src="/assets/img/Delete contact.png">
//                 </div>
//             </div>
//     `;

//     document.getElementById('contact-container-right').innerHTML = loadDoppleData;
// }

function loadContactData(i,initials) {
    return ` <div  class="contact-group">
                <h2>A</h2>
                <div class="contact-item ">
                    <div class="avatar"><span class="b-${array[i].color}">${initials}</span></div>
                        <div class="details">
                            <div class="name">${array[i].name}</div>
                            <div class="email">${array[i].email}</div>
                        </div>
                </div>
            </div>`
}
