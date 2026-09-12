// Firebase configuration for OpenNote
// IMPORTANT:
// This configuration belongs to the EXISTING SR WORLD Firebase project.
// Do not change the Firebase project or credentials.

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRnPUowHmOKCi6GqBv9SaNH-uOUpQkGZ8",
    authDomain: "sr-world-8ccca.firebaseapp.com",
    projectId: "sr-world-8ccca",
    storageBucket: "sr-world-8ccca.appspot.com",
    messagingSenderId: "387895607700",
    appId: "1:387895607700:web:7124c785e9487f15dccf81",
    measurementId: "G-3EB34CBDBX"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);