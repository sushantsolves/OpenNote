// OpenNote — Notes Controller

import {
    getFiles,
    saveFile,
    deleteFile
} from "../firebase/firestore.js";

let notes = [];
let activeNoteId = null;
let activeFolderId = null;

export async function loadNotes(folderId) {
    if (!folderId) {
        notes = [];
        activeNoteId = null;
        activeFolderId = null;
        return [];
    }

    activeFolderId = folderId;
    activeNoteId = null;

    notes = await getFiles(folderId);

    if (notes.length > 0) {
        activeNoteId = notes[0].id;
    }

    return notes;
}

export function getNotesState() {
    return {
        notes,
        activeNoteId,
        activeFolderId
    };
}

export function selectNote(noteId) {
    const exists = notes.some(
        (note) => note.id === noteId
    );

    if (!exists) {
        return false;
    }

    activeNoteId = noteId;
    return true;
}

export async function createNote(
    folderId,
    name = "Untitled Note",
    content = ""
) {
    if (!folderId) {
        throw new Error("A folder must be selected.");
    }

    const fileId = `file_${Date.now()}`;
    const noteName =
        name.trim() || "Untitled Note";

    await saveFile(
        folderId,
        fileId,
        noteName,
        content
    );

    const note = {
        id: fileId,
        name: noteName,
        content
    };

    notes.push(note);
    activeNoteId = fileId;
    activeFolderId = folderId;

    return note;
}

export async function updateNote(
    folderId,
    noteId,
    name,
    content
) {
    if (!folderId || !noteId) {
        throw new Error(
            "Folder and note are required."
        );
    }

    const noteName =
        name.trim() || "Untitled Note";

    await saveFile(
        folderId,
        noteId,
        noteName,
        content
    );

    const note = notes.find(
        (item) => item.id === noteId
    );

    if (note) {
        note.name = noteName;
        note.content = content;
    }

    activeNoteId = noteId;
}

export async function removeNote(
    folderId,
    noteId
) {
    if (!folderId || !noteId) {
        throw new Error(
            "Folder and note are required."
        );
    }

    await deleteFile(
        folderId,
        noteId
    );

    notes = notes.filter(
        (note) => note.id !== noteId
    );

    if (activeNoteId === noteId) {
        activeNoteId =
            notes.length > 0
                ? notes[0].id
                : null;
    }
}