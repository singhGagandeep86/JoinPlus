function editOpen(i) {
    let edit = document.getElementById('popupTaskInfo');
    edit.innerHTML = '';
    init()
    edit.innerHTML = editTask();
    let area = document.getElementById('edit');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}