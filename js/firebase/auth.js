// ============================================================
// OpenNote - Firebase Authentication
// ============================================================
// This file contains the authentication logic migrated from
// the original SR WORLD application.
//
// IMPORTANT:
// - Uses the EXISTING Firebase Authentication project.
// - Do not change the authentication methods.
// - Do not create another Firebase project.
// ============================================================

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

import { auth } from "./firebase-config.js";

// ------------------------------------------------------------
// Sign Up
// ------------------------------------------------------------

export async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: userCredential.user
        };

    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}


// ------------------------------------------------------------
// Sign In
// ------------------------------------------------------------

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        return {
            success: true,
            user: userCredential.user
        };

    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}


// ------------------------------------------------------------
// Sign Out
// ------------------------------------------------------------

export async function signOutUser() {
    try {
        await signOut(auth);

        return {
            success: true
        };

    } catch (error) {
        return {
            success: false,
            error: error
        };
    }
}


// ------------------------------------------------------------
// Authentication State Listener
// ------------------------------------------------------------

export function observeAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}


// ------------------------------------------------------------
// Current Authenticated User
// ------------------------------------------------------------

export function getCurrentUser() {
    return auth.currentUser;
}