// OpenNote — Firestore Data Layer
// Existing SR WORLD Firebase structure is preserved.

import {
    doc,
    setDoc,
    getDocs,
    collection,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

import { db } from "./firebase-config.js";
import { getCurrentUser } from "./auth.js";


function requireUser() {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("No authenticated user.");
    }

    return user;
}


// ================================
// FOLDERS
// ================================

export async function getFolders() {
    const user = requireUser();

    const foldersRef = collection(
        db,
        "users",
        user.uid,
        "folders"
    );

    const snapshot = await getDocs(foldersRef);

    const folders = [];

    snapshot.forEach((folderDoc) => {
        folders.push({
            id: folderDoc.id,
            name: folderDoc.data().name
        });
    });

    // Preserve existing Root-folder behavior
    if (folders.length === 0) {
        const rootRef = doc(foldersRef, "root");

        await setDoc(rootRef, {
            name: "Root"
        });

        folders.push({
            id: "root",
            name: "Root"
        });
    }

    return folders;
}


export async function saveFolder(folderId, name) {
    const user = requireUser();

    const folderRef = doc(
        db,
        "users",
        user.uid,
        "folders",
        folderId
    );

    await setDoc(folderRef, {
        name
    });
}


export async function deleteFolder(folderId) {
    const user = requireUser();

    // Delete files inside the folder first
    const filesRef = collection(
        db,
        "users",
        user.uid,
        "folders",
        folderId,
        "files"
    );

    const filesSnapshot = await getDocs(filesRef);

    for (const fileDoc of filesSnapshot.docs) {
        await deleteDoc(fileDoc.ref);
    }

    // Then delete the folder itself
    const folderRef = doc(
        db,
        "users",
        user.uid,
        "folders",
        folderId
    );

    await deleteDoc(folderRef);
}


// ================================
// FILES / NOTES
// ================================

export async function getFiles(folderId) {
    const user = requireUser();

    const filesRef = collection(
        db,
        "users",
        user.uid,
        "folders",
        folderId,
        "files"
    );

    const snapshot = await getDocs(filesRef);

    const files = [];

    snapshot.forEach((fileDoc) => {
        const data = fileDoc.data();

        files.push({
            id: fileDoc.id,
            name: data.name,
            content: data.content
        });
    });

    return files;
}


export async function getAllFiles(folders) {
    const allFiles = {};

    for (const folder of folders) {
        allFiles[folder.id] = await getFiles(folder.id);
    }

    return allFiles;
}


export async function saveFile(
    folderId,
    fileId,
    name,
    content
) {
    const user = requireUser();

    const fileRef = doc(
        db,
        "users",
        user.uid,
        "folders",
        folderId,
        "files",
        fileId
    );

    await setDoc(fileRef, {
        name,
        content
    });
}


export async function deleteFile(folderId, fileId) {
    const user = requireUser();

    const fileRef = doc(
        db,
        "users",
        user.uid,
        "folders",
        folderId,
        "files",
        fileId
    );

    await deleteDoc(fileRef);
}