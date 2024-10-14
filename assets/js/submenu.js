document.getElementById('burgerToggle').addEventListener('click', function() {
    let menu = document.getElementById('burgerMenu');
    menu.classList.toggle('open');

    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    let menu = document.getElementById('burgerMenu');
    let toggle = document.getElementById('burgerToggle');

    if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('open');
    }
});
