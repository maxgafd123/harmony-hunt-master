import { deleteApp, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: 'AIzaSyAwaHkL4Qai2wjl7jrGmQOwR_s7pGV3PoI',
    authDomain: "music-review-website.firebaseapp.com",
    projectId: "music-review-website",
    storageBucket: "music-review-website.appspot.com",
    messagingSenderId: "707117055059",
    appId: "1:707117055059:web:7cecf02fdcc56a61831aa6",
}
// Initialize Firebase
let firebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApp()
    deleteApp(firebaseApp)
    firebaseApp = initializeApp(firebaseConfig);
}

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);