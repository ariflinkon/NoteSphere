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
        this.notes.unshift(note); // Add to beginning for latest on top
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
            <div class="col-md-6">
                <div class="card note-card h-100 shadow-sm" data-id="${note.id}">
                    <div class="card-body">
                        <h5 class="card-title">${note.title}</h5>
                        <p class="card-text">${note.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <small class="text-muted">${note.timestamp}</small>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    },

    setupEventListeners(app) {
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const titleInput = document.getElementById("note-title-input");
            const descriptionInput = document.getElementById("note-description-input");

            const title = titleInput.value.trim();
            const description = descriptionInput.value.trim();

            if (title && description) {
                app.addNote(title, description);
                titleInput.value = "";
                descriptionInput.value = "";
            }
        });

        document.getElementById("notes-container").addEventListener("click", (event) => {
            if (event.target.closest(".delete-btn")) {
                const noteCard = event.target.closest(".note-card");
                const noteId = Number(noteCard.dataset.id);
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
