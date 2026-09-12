// OpenNote — Dashboard Controller

import {
    getFolders,
    getAllFiles
} from "../firebase/firestore.js";

let currentUser = null;
let folders = [];
let files = {};

export async function loadDashboard(user) {
    currentUser = user;

    folders = await getFolders();
    files = await getAllFiles(folders);

    console.log("OpenNote: Dashboard loaded");
    console.log("Folders:", folders);
    console.log("Files:", files);

    return {
        user: currentUser,
        folders,
        files
    };
}

export function getDashboardData() {
    return {
        user: currentUser,
        folders,
        files
    };
}