document.getElementById('burgerToggle').addEventListener('click', function() {
    const menu = document.getElementById('burgerMenu');
    menu.classList.toggle('active');
});

document.getElementById('burgerToggle').addEventListener('click', function(event) {
    if (event.target === document.getElementById('burgerToggle')) {
        document.getElementById('burgerToggle').classList.remove('active');
    }
});
