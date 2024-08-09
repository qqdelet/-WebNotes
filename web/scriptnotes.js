async function saveNote() {
    var title = document.getElementById('title').value;
    var content = document.getElementById('content').value;
    var imageInput = document.getElementById('image');
    var image = imageInput.files[0]; 
    
    if (!title || !content) {
        alert("Введите заголовок и текст заметки!");
        return;
    }
    
    if (image) {
        var reader = new FileReader();
        reader.onload = function(event) {
            var imageData = event.target.result; 
            eel.save_note(title, content, imageData)();
        };
        reader.readAsDataURL(image); 
    } else {
        eel.save_note(title, content, null)();
    }
    
    reloadNotes();
}

async function deleteNote(id) {
    await eel.delete_note(id)();
    reloadNotes();
}

async function editNote(id) {
    let title = prompt("Введите новый заголовок:");
    let content = prompt("Введите новый текст:");
    if (title && content) {
        await eel.edit_note(id, title, content)();
        reloadNotes();
    }
}

async function toggleContent(titleElement) {
    var noteElement = titleElement.parentElement; // Получаем родительский элемент (заметку)
    noteElement.classList.toggle('hidden'); // Добавляем или убираем класс 'hidden', чтобы скрыть или показать заметку
}

async function moveNoteUp(id) {
    let note = await eel.get_note(id)();
    if (!note.pinned) { // Проверяем, не закреплена ли заметка
        await eel.move_note_up(id)();
        reloadNotes();
    } else {
        alert("Нельзя перемещать закрепленную заметку.");
    }
}

async function moveNoteDown(id) {
    let note = await eel.get_note(id)();
    if (!note.pinned) { // Проверяем, не закреплена ли заметка
        await eel.move_note_down(id)();
        reloadNotes();
    } else {
        alert("Нельзя перемещать закрепленную заметку.");
    }
}

async function reloadNotes() {
    let notes = await eel.get_notes()();
    let container = document.getElementById("notesContainer");
    container.innerHTML = '';
    notes.forEach(note => {
        let noteElement = document.createElement('div');
        noteElement.className = 'note';
        
        let contentHtml = `<h3 onclick="toggleContent(this)">${note.title} ${note.pinned ? '📌' : ''} &#x1F575;</h3>`;
        contentHtml += `<div class="contentWrapper">`;
        if (note.image) {
            let imageData = note.image.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
            contentHtml += `<img src="data:image/png;base64,${imageData}" alt="Image">`; 
        }
        contentHtml += `<p class="content">${note.content}</p>`;
        contentHtml += `</div>`; 
        contentHtml += `<button class="move-up" onclick="moveNoteUp(${note.id})">🔼</button>`;
        contentHtml += `<button class="move-down" onclick="moveNoteDown(${note.id})">🔽</button>`;
        contentHtml += `<button onclick="editNote(${note.id})">Редактировать</button>`;
        contentHtml += `<button onclick="deleteNote(${note.id})">Удалить</button>`;
        noteElement.innerHTML = contentHtml;
        
        if (note.pinned) {
            container.prepend(noteElement);
        } else {
            container.appendChild(noteElement); 
        }
    });
}



window.onload = function() {
    reloadNotes();
}
