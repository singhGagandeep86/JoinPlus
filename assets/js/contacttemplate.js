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

function loadContactData(name, email, phone) {
    let loadData = `
        <div class="contactfinal">
            <div class="contact-ellipse">
                <button>${name.charAt(0)}${name.split(' ')[1].charAt(0)}</button>
            </div>
            <div class="contact-info">
                <h1>${name}</h1>
                <div class="contact-info-images">
                    <img class="editimages" src="/assets/img/edit contacts.png">
                    <img class="editimages editimages2" src="/assets/img/Delete contact.png">
                </div>
            </div>
        </div>
        <h2 class="CI-info">Kontaktinformationen</h2>
        <div class="rest-info">
            <h5>Email</h5>
            <p style="color: #007CEE;">${email}</p>
            <h5>Telefon</h5>
            <h6>${phone}</h6>
        </div>`;

    document.getElementById('contact-container-right').innerHTML = loadData;
}
