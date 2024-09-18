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