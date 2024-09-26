function editOpen(i) {
    let edit = document.getElementById('popupTaskInfo');
    edit.innerHTML = '';
    init()
    edit.innerHTML = editTask1();
    let area = document.getElementById('edit');
    area.addEventListener('click', (event) => {
        event.stopPropagation()
    })
}