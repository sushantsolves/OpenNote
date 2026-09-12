// OpenNote — Dashboard UI Controller

import {
    loadDashboard,
    getDashboardData
} from "./dashboard.js";

import {
    selectFolder,
    getActiveFolderId,
    createFolder,
    removeFolder
} from "./folders.js";

import {
    loadNotes,
    getNotesState,
    selectNote,
    createNote,
    updateNote,
    removeNote
} from "./notes.js";

import {
    observeAuthState,
    signOutUser
} from "../firebase/auth.js";

import { showToast } from "../components/toast.js";


/* =========================================
   DOM REFERENCES
========================================= */

const dashboard =
    document.getElementById("dashboard");

const folderList =
    document.getElementById("sidebar-folder-list");

const notesList =
    document.getElementById("notes-list");

const notesCount =
    document.getElementById("notes-count");

const currentFolderName =
    document.getElementById("current-folder-name");

const noteTitle =
    document.getElementById("note-title");

const noteContent =
    document.getElementById("note-content");

const editorBody =
    document.getElementById("editor-body");

const notesEmpty =
    document.getElementById("notes-empty");

const saveStatus =
    document.getElementById("save-status");

const newNoteButton =
    document.getElementById("new-note-button");

const newFolderButton =
    document.getElementById("new-folder-button");

const addFolderButton =
    document.getElementById("add-folder-button");

const saveNoteButton =
    document.getElementById("save-note-button");

const deleteNoteButton =
    document.getElementById("delete-note-button");

const logoutButton =
    document.getElementById("logout-button");


/* =========================================
   AUTH STATE
========================================= */

observeAuthState(async (user) => {

    if (!user) {
        return;
    }

    try {

        if (dashboard) {
            dashboard.classList.remove("hidden");
        }

        await initialiseDashboard(user);

    } catch (error) {

        console.error(
            "Dashboard initialisation failed:",
            error
        );

        showToast(
            "Unable to load your notes.",
            "error"
        );
    }
});


/* =========================================
   INITIALISE DASHBOARD
========================================= */

async function initialiseDashboard(user) {

    await loadDashboard(user);

    renderFolders();

    const data =
        getDashboardData();

    if (!data.folders.length) {
        clearEditor();
        renderNotes([]);
        return;
    }

    const firstFolder =
        data.folders[0];

    selectFolder(firstFolder.id);

    await refreshNotes(
        firstFolder.id
    );
}


/* =========================================
   FOLDERS
========================================= */

function renderFolders() {

    if (!folderList) return;

    const {
        folders
    } = getDashboardData();

    folderList.innerHTML = "";

    folders.forEach((folder) => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "folder-item";

        button.dataset.folderId =
            folder.id;

        button.innerHTML = `
            <span class="folder-icon">📁</span>
            <span class="folder-name">
                ${escapeHtml(folder.name)}
            </span>
        `;

        button.addEventListener(
            "click",
            async () => {

                await handleFolderSelection(
                    folder.id
                );
            }
        );

        folderList.appendChild(button);
    });

    updateActiveFolderUI();
}


async function handleFolderSelection(folderId) {

    if (!selectFolder(folderId)) {
        return;
    }

    updateActiveFolderUI();

    await refreshNotes(folderId);
}


function updateActiveFolderUI() {

    const activeFolderId =
        getActiveFolderId();

    document
        .querySelectorAll(".folder-item")
        .forEach((item) => {

            item.classList.toggle(
                "active",
                item.dataset.folderId ===
                activeFolderId
            );
        });

    const {
        folders
    } = getDashboardData();

    const activeFolder =
        folders.find(
            (folder) =>
                folder.id === activeFolderId
        );

    if (currentFolderName) {

        currentFolderName.textContent =
            activeFolder?.name ||
            "Root";
    }
}


/* =========================================
   NOTES
========================================= */

async function refreshNotes(folderId) {

    try {

        const notes =
            await loadNotes(folderId);

        renderNotes(notes);

        const state =
            getNotesState();

        if (state.activeNoteId) {

            openNote(
                state.activeNoteId
            );

        } else {

            clearEditor();
        }

    } catch (error) {

        console.error(
            "Failed to load notes:",
            error
        );

        showToast(
            "Unable to load notes.",
            "error"
        );
    }
}


function renderNotes(notes) {

    if (!notesList) return;

    notesList.innerHTML = "";

    if (notesCount) {

        notesCount.textContent =
            `${notes.length} ${
                notes.length === 1
                    ? "note"
                    : "notes"
            }`;
    }

    if (!notes.length) {

        if (notesEmpty) {
            notesEmpty.classList.remove(
                "hidden"
            );
        }

        return;
    }

    if (notesEmpty) {
        notesEmpty.classList.add(
            "hidden"
        );
    }

    notes.forEach((note) => {

        const item =
            document.createElement("button");

        item.type = "button";

        item.className =
            "note-item";

        item.dataset.noteId =
            note.id;

        const preview =
            note.content
                ? note.content
                    .replace(/\s+/g, " ")
                    .trim()
                : "No content yet";

        item.innerHTML = `
            <span class="note-item-icon">📝</span>

            <span class="note-item-info">

                <span class="note-item-title">
                    ${escapeHtml(note.name)}
                </span>

                <span class="note-item-preview">
                    ${escapeHtml(preview)}
                </span>

            </span>
        `;

        item.addEventListener(
            "click",
            () => {

                if (
                    selectNote(note.id)
                ) {

                    openNote(note.id);
                }
            }
        );

        notesList.appendChild(item);
    });

    updateActiveNoteUI();
}


function openNote(noteId) {

    const {
        notes
    } = getNotesState();

    const note =
        notes.find(
            (item) =>
                item.id === noteId
        );

    if (!note) {
        return;
    }

    if (noteTitle) {
        noteTitle.value =
            note.name || "";
    }

    if (noteContent) {
        noteContent.value =
            note.content || "";
    }

    if (editorBody) {
        editorBody.classList.remove(
            "hidden"
        );
    }

    if (notesEmpty) {
        notesEmpty.classList.add(
            "hidden"
        );
    }

    updateActiveNoteUI();

    setSaveStatus("Saved");
}


function updateActiveNoteUI() {

    const {
        activeNoteId
    } = getNotesState();

    document
        .querySelectorAll(".note-item")
        .forEach((item) => {

            item.classList.toggle(
                "active",
                item.dataset.noteId ===
                activeNoteId
            );
        });
}


/* =========================================
   CREATE NOTE
========================================= */

async function createNewNote() {

    const folderId =
        getActiveFolderId();

    if (!folderId) {

        showToast(
            "Select a folder first.",
            "error"
        );

        return;
    }

    try {

        const note =
            await createNote(
                folderId
            );

        renderNotes(
            getNotesState().notes
        );

        openNote(note.id);

        if (noteTitle) {
            noteTitle.focus();
        }

        showToast(
            "New note created.",
            "success"
        );

    } catch (error) {

        console.error(
            "Create note failed:",
            error
        );

        showToast(
            "Unable to create note.",
            "error"
        );
    }
}


/* =========================================
   SAVE NOTE
========================================= */

async function saveCurrentNote() {

    const {
        activeNoteId,
        activeFolderId
    } = getNotesState();

    if (
        !activeNoteId ||
        !activeFolderId
    ) {

        showToast(
            "No note selected.",
            "error"
        );

        return;
    }

    const name =
        noteTitle?.value || "";

    const content =
        noteContent?.value || "";

    try {

        setSaveStatus("Saving...");

        await updateNote(
            activeFolderId,
            activeNoteId,
            name,
            content
        );

        renderNotes(
            getNotesState().notes
        );

        updateActiveNoteUI();

        setSaveStatus("Saved");

        showToast(
            "Note saved.",
            "success"
        );

    } catch (error) {

        console.error(
            "Save note failed:",
            error
        );

        setSaveStatus("Not saved");

        showToast(
            "Unable to save note.",
            "error"
        );
    }
}


/* =========================================
   CREATE FOLDER
========================================= */

async function createNewFolder() {

    const name =
        window.prompt(
            "Enter folder name:"
        );

    if (name === null) {
        return;
    }

    if (!name.trim()) {

        showToast(
            "Folder name cannot be empty.",
            "error"
        );

        return;
    }

    try {

        const folder =
            await createFolder(name);

        const data =
            getDashboardData();

        data.folders.push(folder);

        renderFolders();

        selectFolder(folder.id);

        updateActiveFolderUI();

        await refreshNotes(
            folder.id
        );

        showToast(
            "Folder created.",
            "success"
        );

    } catch (error) {

        console.error(
            "Create folder failed:",
            error
        );

        showToast(
            "Unable to create folder.",
            "error"
        );
    }
}


/* =========================================
   DELETE NOTE
========================================= */

async function deleteCurrentNote() {

    const {
        activeNoteId,
        activeFolderId
    } = getNotesState();

    if (
        !activeNoteId ||
        !activeFolderId
    ) {

        showToast(
            "No note selected.",
            "error"
        );

        return;
    }

    const confirmed =
        window.confirm(
            "Delete this note?"
        );

    if (!confirmed) {
        return;
    }

    try {

        await removeNote(
            activeFolderId,
            activeNoteId
        );

        const notes =
            getNotesState().notes;

        renderNotes(notes);

        if (notes.length > 0) {

            openNote(
                notes[0].id
            );

        } else {

            clearEditor();
        }

        showToast(
            "Note deleted.",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete note failed:",
            error
        );

        showToast(
            "Unable to delete note.",
            "error"
        );
    }
}


/* =========================================
   DELETE FOLDER
========================================= */

async function deleteCurrentFolder() {

    const folderId =
        getActiveFolderId();

    if (
        !folderId ||
        folderId === "root"
    ) {

        showToast(
            "The Root folder cannot be deleted.",
            "error"
        );

        return;
    }

    const {
        folders
    } = getDashboardData();

    const folder =
        folders.find(
            (item) =>
                item.id === folderId
        );

    const confirmed =
        window.confirm(
            `Delete "${folder?.name || "this folder"}" and all its notes?`
        );

    if (!confirmed) {
        return;
    }

    try {

        await removeFolder(
            folderId
        );

        const index =
            folders.findIndex(
                (item) =>
                    item.id === folderId
            );

        if (index !== -1) {
            folders.splice(index, 1);
        }

        renderFolders();

        const nextFolder =
            folders[0];

        if (nextFolder) {

            selectFolder(
                nextFolder.id
            );

            updateActiveFolderUI();

            await refreshNotes(
                nextFolder.id
            );

        } else {

            clearEditor();
            renderNotes([]);
        }

        showToast(
            "Folder deleted.",
            "success"
        );

    } catch (error) {

        console.error(
            "Delete folder failed:",
            error
        );

        showToast(
            "Unable to delete folder.",
            "error"
        );
    }
}


/* =========================================
   CLEAR EDITOR
========================================= */

function clearEditor() {

    if (noteTitle) {
        noteTitle.value = "";
    }

    if (noteContent) {
        noteContent.value = "";
    }

    if (editorBody) {
        editorBody.classList.add(
            "hidden"
        );
    }

    if (notesEmpty) {
        notesEmpty.classList.remove(
            "hidden"
        );
    }

    setSaveStatus("");
}


/* =========================================
   SAVE STATUS
========================================= */

function setSaveStatus(status) {

    if (!saveStatus) return;

    saveStatus.textContent =
        status;
}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

    try {

        const result =
            await signOutUser();

        if (!result.success) {
            throw result.error;
        }

        showToast(
            "Signed out successfully.",
            "success"
        );

    } catch (error) {

        console.error(
            "Logout failed:",
            error
        );

        showToast(
            "Unable to sign out.",
            "error"
        );
    }
}


/* =========================================
   EVENT LISTENERS
========================================= */

newNoteButton?.addEventListener(
    "click",
    createNewNote
);

newFolderButton?.addEventListener(
    "click",
    createNewFolder
);

addFolderButton?.addEventListener(
    "click",
    createNewFolder
);

saveNoteButton?.addEventListener(
    "click",
    saveCurrentNote
);

deleteNoteButton?.addEventListener(
    "click",
    deleteCurrentNote
);

logoutButton?.addEventListener(
    "click",
    logout
);


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            (event.ctrlKey ||
                event.metaKey) &&
            event.key.toLowerCase() === "s"
        ) {

            event.preventDefault();

            saveCurrentNote();
        }
    }
);


/* =========================================
   HTML ESCAPE
========================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}