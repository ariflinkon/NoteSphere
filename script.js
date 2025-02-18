// 1. Main Application Logic
class NoteApp {
    constructor() {
        this.notes = Storage.getNotes(); // Load notes from local storage
        this.initUI(); // Initialize UI components
    }

    initUI() {
        UI.renderNotes(this.notes);
        UI.setupEventListeners(this);
    }

    addNote(content) {
        const note = new Note(Date.now(), content);
        this.notes.push(note);
        Storage.saveNotes(this.notes);
        UI.renderNotes(this.notes);
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        Storage.saveNotes(this.notes);
        UI.renderNotes(this.notes);
    }
}

// 2. Note Model
class Note {
    constructor(id, content) {
        this.id = id;
        this.content = content;
        this.timestamp = new Date().toLocaleString();
    }
}

// 3. UI Handling
const UI = {
    renderNotes(notes) {
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = notes.map(note => `
            <div class="note" data-id="${note.id}">
                <p>${note.content}</p>
                <small>${note.timestamp}</small>
                <button class="delete-btn">Delete</button>
            </div>
        `).join("");
    },

    setupEventListeners(app) {
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const input = document.getElementById("note-input");
            if (input.value.trim()) {
                app.addNote(input.value);
                input.value = ""; // Clear input
            }
        });

        document.getElementById("notes-container").addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-btn")) {
                const noteId = Number(event.target.parentElement.dataset.id);
                app.deleteNote(noteId);
            }
        });
    }
};

// 4. Local Storage Handling
const Storage = {
    getNotes() {
        return JSON.parse(localStorage.getItem("notes")) || [];
    },

    saveNotes(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }
};

// 5. Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    new NoteApp();
});
