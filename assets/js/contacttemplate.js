document.getElementById('add-contact-btn').addEventListener('click', function() {
    document.getElementById('overlay').classList.add('show');
});

document.getElementById('cancel-btn').addEventListener('click', function() {
    document.getElementById('overlay').classList.remove('show');
});

document.getElementById('close-btn').addEventListener('click', function() {
    document.getElementById('overlay').classList.remove('show');
});