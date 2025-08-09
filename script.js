let notes = [];
let editingNote = null;

function loadNotes() {
    const notesData = localStorage.getItem('notes');
    return notesData ? JSON.parse(notesData) : [];
}

function deleteNote(title) {
    notes = notes.filter(note => note.title !== title);
    saveNotes();
}

function saveNote(event) {
    event.preventDefault(); 

    const noteTitle = document.getElementById('noteTitle').value.trim();
    const noteContent = document.getElementById('noteContent').value.trim();


    if (editingNote) {
        const index = notes.findIndex(note => note.id === editingNote.id);
        if (index !== -1) {
            notes[index].title = noteTitle;
            notes[index].content = noteContent;
        }
        editingNote = null;
    }
    else {
        notes.unshift({
            id: Date.now(),
            title: noteTitle,
            content: noteContent
    });
    }

    saveNotes();
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
    closeNoteDialog();
}

function renderNotes() {
    const notesContainer = document.getElementById('notesContainer');

    if(notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="no-notes">
                <h2>No notes available</h2>
                <p>Click the button below to create a new note.</p>
                <button class="new-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
            </div>
        `
        return;
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class="note">
            <div class="note-actions">
                <button class="edit-btn" onclick="openNoteDialog(${note.id})">  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23">
                <path d="M184-184v-83.77l497.23-498.77q5.15-5.48 11.07-7.47 5.93-1.99 11.99-1.99 6.06 0 11.62 1.54 5.55 1.54 11.94 7.15l38.69 37.93q5.61 6.38 7.54 12 1.92 5.63 1.92 12.25 0 6.13-2.24 12.06-2.24 5.92-7.22 11.07L267.77-184H184Zm505.15-466.46L744-704.54 704.54-744l-54.08 54.85 38.69 38.69Z"/>
                </svg>
                </button>
                <button class="delete-btn" onclick="deleteNote('${note.title}')">  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#191b23">
                <path d="M291-267.69 267.69-291l189-189-189-189L291-692.31l189 189 189-189L692.31-669l-189 189 189 189L669-267.69l-189-189-189 189Z"/>
                </svg>
                </button>
            </div>
            <h3>${note.title}</h3>
            <p>${note.content}</p>
        </div>
    `).join('');
}

function openNoteDialog(noteId) {
    const noteDialog = document.getElementById('noteDialog');
    const noteTitleInput = document.getElementById('noteTitle');
    const noteContentInput = document.getElementById('noteContent');

    if (noteId) {
        editingNote = notes.find(note => note.id === noteId);
        if (editingNote) {
            noteTitleInput.value = editingNote.title;
            noteContentInput.value = editingNote.content;
        }
    } else {
        editingNote = null;
        noteTitleInput.value = '';
        noteContentInput.value = '';
    }

    noteDialog.showModal();
    noteTitleInput.focus();
}

function closeNoteDialog() {
    const noteDialog = document.getElementById('noteDialog');
    noteDialog.close();

    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    editingNote = null;
}


document.addEventListener('DOMContentLoaded', () => {

    notes = loadNotes();
    renderNotes();

    document.getElementById('noteForm').addEventListener('submit', saveNote);

    document.getElementById('noteDialog').addEventListener('click', function(event) {
        if (event.target === this) {
            closeNoteDialog();
        }
    });
})

document.getElementById('darkModeToggle').addEventListener('click', () => {
    let theme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', theme);
})
