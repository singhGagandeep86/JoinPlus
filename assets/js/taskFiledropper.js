


document.getElementById('fileDrop').addEventListener("drop", dropHandler);

document.getElementById('fileDrop').addEventListener("dragover", (event) => {
    event.preventDefault();
    document.getElementById('fileDrop').classList.add('picker-active');
});

document.getElementById('fileDrop').addEventListener("drop", (event) => {
    event.preventDefault();
    document.getElementById('fileDrop').classList.remove('picker-active');
});

document.getElementById('fileDrop').addEventListener("dragleave", (event) => {
    event.preventDefault();
    document.getElementById('fileDrop').classList.remove('picker-active');
});


/** Handles the drop event in the task edit page. Prevents the default event handler and removes the active class from the picker area.
 * Iterates over the dropped files and checks if the file is an image. If the file is not an image, an error message is displayed.
 * If the file is an image, it is sent to be manipulated. */
function dropHandler(event) {
    event.preventDefault();
    document.getElementById('fileDrop').classList.remove('picker-active');
    const error = document.getElementById('error');
    error.innerHTML = '';
    [...event.dataTransfer.items].forEach(async (item, i) => {
        if (item.kind === "file") {
            const file = item.getAsFile();
            if (!allowedTypes.includes(file.type)) return error.innerHTML = `<b>${file.type}</b>type is not Allowed!`;
            manipulateFile(file);
        }
    });
}