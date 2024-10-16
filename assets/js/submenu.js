let toggleButton = document.getElementById('burgerToggle');
let menu = document.getElementById('burgerMenu');

toggleButton.addEventListener('click', function(event) {
    menu.classList.toggle('open');
    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
        menu.classList.remove('open');
    }
});