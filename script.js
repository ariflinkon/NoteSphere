// NoteApp.js
class NoteApp {
    constructor() {
        this.notes = NoteStorage.load();
        this.init();
    }

    init() {
        NoteUI.display(this.notes);
        NoteUI.bindEvents({
            onAdd: (title, description) => this.addNote(title, description),
            onDelete: (id) => this.deleteNote(id)
        });
    }

    addNote(title, description) {
        const note = new Note(Date.now(), title, description);
        this.notes.unshift(note);
        NoteStorage.save(this.notes);
        NoteUI.display(this.notes);
    }

    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id !== id);
        NoteStorage.save(this.notes);
        NoteUI.display(this.notes);
    }
}

// Note.js
class Note {
    constructor(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.timestamp = new Date().toLocaleString();
    }
}

// NoteUI.js
const NoteUI = (() => {
    const titleInput = () => document.getElementById("note-title-input");
    const descriptionInput = () => document.getElementById("note-description-input");
    const notesContainer = () => document.getElementById("notes-container");

    function display(notes) {
        notesContainer().innerHTML = notes.map(note => `
            <div class="col-md-6">
                <div class="card note-card h-100 shadow-sm" data-id="${note.id}">
                    <div class="card-body">
                        <h5 class="card-title">${note.title}</h5>
                        <p class="card-text">${note.description}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <small class="text-muted">${note.timestamp}</small>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-action="delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join("");
    }

    function bindEvents({ onAdd, onDelete }) {
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const title = titleInput().value.trim();
            const description = descriptionInput().value.trim();
            if (title && description) {
                onAdd(title, description);
                titleInput().value = "";
                descriptionInput().value = "";
            }
        });

        notesContainer().addEventListener("click", (e) => {
            if (e.target.closest("[data-action='delete']")) {
                const card = e.target.closest(".note-card");
                const id = Number(card.dataset.id);
                onDelete(id);
            }
        });
    }

    return { display, bindEvents };
})();

// NoteStorage.js
const NoteStorage = {
    load() {
        return JSON.parse(localStorage.getItem("notes")) || [];
    },
    save(notes) {
        localStorage.setItem("notes", JSON.stringify(notes));
    }
};

// Entry point
document.addEventListener("DOMContentLoaded", () => {
    new NoteApp();
});
