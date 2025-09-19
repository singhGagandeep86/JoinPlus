


document.getElementById('fileDrop').addEventListener("drop", dropHandler);

document.getElementById('fileDrop').addEventListener("dragover", (e) => {
    e.preventDefault();
    document.getElementById('fileDrop').classList.add('picker-active');
});

document.getElementById('fileDrop').addEventListener("drop", (e) => {
    e.preventDefault();
    document.getElementById('fileDrop').classList.remove('picker-active');
});

document.getElementById('fileDrop').addEventListener("dragleave", (e) => {
    e.preventDefault();
    document.getElementById('fileDrop').classList.remove('picker-active');
});


function dropHandler(event) {
    event.preventDefault();
     document.getElementById('fileDrop').classList.remove('picker-active');
    const error = document.getElementById('error');
    error.innerHTML = '';
    [...event.dataTransfer.items].forEach(async (item, i) => {
        if (item.kind === "file") {
            const file = item.getAsFile();
            if (!file.type.startsWith('image/')) return error.innerHTML = `<b>${file.type}</b>type is not Allowed!`;
            manipulateFile(file);
        }
    });
}