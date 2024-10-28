/**
 * Toggle button element for the burger menu.
 * @type {HTMLElement}
 */

let toggleButton = document.getElementById('burgerToggle');

/**
 * Menu element for the burger menu.
 * @type {HTMLElement}
 */

let menu = document.getElementById('burgerMenu');

/**
 * Adds an event listener to the toggle button to open or close the burger menu
 * when clicked, and prevents event propagation.
 * @param {Event} event - The click event.
 */

toggleButton.addEventListener('click', function(event) {
    menu.classList.toggle('open');
    event.stopPropagation();
});

/**
 * Adds an event listener to the document to close the burger menu if a click
 * occurs outside the menu or toggle button.
 * @param {Event} event - The click event.
 */

document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !toggleButton.contains(event.target)) {
        menu.classList.remove('open');
    }
});