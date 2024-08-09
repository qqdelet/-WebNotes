import eel
import atexit
import json
import base64

eel.init('web')

notes = []
next_id = 1

def save_notes_to_file():
    try:
        with open('notes.json', 'w') as f:
            json.dump(notes, f)
    except Exception as e:
        print(f"Ошибка при сохранении данных: {e}")

def load_notes_from_file():
    global notes
    try:
        with open('notes.json', 'r') as f:
            notes = json.load(f)
    except FileNotFoundError:
        notes = []
    except Exception as e:
        print(f"Ошибка при загрузке данных: {e}")

load_notes_from_file()

@eel.expose
def save_note(title, content, image):
    global next_id
    global notes
    
    if image:
        image_data = image
    else:
        image_data = None

    notes.append({'id': next_id, 'title': title, 'content': content, 'image': image_data})
    next_id += 1
    save_notes_to_file()

@eel.expose
def get_notes():
    return notes

@eel.expose
def delete_note(id):
    global notes
    notes = [note for note in notes if note['id'] != id]
    save_notes_to_file()

@eel.expose
def edit_note(id, title, content):
    global notes
    for note in notes:
        if note['id'] == id:
            note['title'] = title
            note['content'] = content
            break
    save_notes_to_file()

@eel.expose
def move_note_up(note_id):
    global notes 
    for i in range(len(notes)):
        if notes[i]['id'] == note_id:
            if i > 0: 
                notes[i], notes[i - 1] = notes[i - 1], notes[i]
                break

    save_notes_to_file()

@eel.expose
def move_note_down(note_id):
    global notes 
    for i in range(len(notes)):
        if notes[i]['id'] == note_id:
            if i < len(notes) - 1:
                notes[i], notes[i + 1] = notes[i + 1], notes[i]
                break
    save_notes_to_file()  

@eel.expose
def get_note(id):
    for note in notes:
        if note['id'] == id:
            return note
    return None


atexit.register(save_notes_to_file)
eel.start('index.html', size=(500, 450))