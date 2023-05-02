import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateEmail, updatePassword } from "firebase/auth";
import { writable } from "svelte/store";
import { auth } from "../lib/firebase";

export const authStore = writable({
    isLoading: true,
    currentUser: null,
    error: null
})

export const authHandlers = {
    login: async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    },
    signup: async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    },
    logout: async () => {
        try {
            await signOut(auth)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    },
    resetPassword: async (email) => {
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    },
    updateEmail: async (email) => {
        try {
            await updateEmail(auth, email)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    },
    updatePassword: async (password) => {
        try {
            await updatePassword(auth, password)
        } catch (err) {
            authStore.update((state) => ({ ...state, error: err.message}));
            throw err;
        }
        
    }
}