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

    addNote(title, description) {
        const note = new Note(Date.now(), title, description);
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
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.timestamp = new Date().toLocaleString();
    }
}

// 3. UI Handling
const UI = {
    renderNotes(notes) {
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = notes.map(note => `
            <div class="note" data-id="${note.id}">
                <h5>${note.title}</h5>
                <p>${note.description}</p>
                <small>${note.timestamp}</small>
                <button class="delete-btn">Delete</button>
            </div>
        `).join("");
    },

    setupEventListeners(app) {
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const titleInput = document.getElementById("note-title-input");
            const descriptionInput = document.getElementById("note-description-input");
            if (titleInput.value.trim() && descriptionInput.value.trim()) {
                app.addNote(titleInput.value, descriptionInput.value);
                titleInput.value = ""; // Clear title input
                descriptionInput.value = ""; // Clear description input
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