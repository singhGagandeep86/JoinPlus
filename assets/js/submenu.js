let toggleButton = document.getElementById('burgerToggle');
let menu = document.getElementById('burgerMenu');

/**
 * Adds an event listener to the toggle button to open or close the burger menu
 * when clicked, and prevents event propagation.
 */

toggleButton.addEventListener('click', function(event) {
    menu.classList.toggle('open');
    event.stopPropagation();
});

/**
 * Adds an event listener to the document to close the burger menu if a click
 * occurs outside the menu or toggle button.
 */

document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
        menu.classList.remove('open');
    }
});