// OpenNote — Folder Controller

import {
    saveFolder,
    deleteFolder
} from "../firebase/firestore.js";

let activeFolderId = null;

export function selectFolder(folderId) {
    if (!folderId) {
        return false;
    }

    activeFolderId = folderId;
    return true;
}

export function getActiveFolderId() {
    return activeFolderId;
}

export async function createFolder(name) {
    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new Error("Folder name cannot be empty.");
    }

    const folderId = `folder_${Date.now()}`;

    await saveFolder(folderId, trimmedName);

    activeFolderId = folderId;

    return {
        id: folderId,
        name: trimmedName
    };
}

export async function removeFolder(folderId) {
    if (!folderId) {
        throw new Error("Folder ID is required.");
    }

    if (folderId === "root") {
        throw new Error("The Root folder cannot be deleted.");
    }

    await deleteFolder(folderId);

    if (activeFolderId === folderId) {
        activeFolderId = null;
    }
}