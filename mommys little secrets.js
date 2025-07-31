// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCWZmXE8b3QFMSjQ_CQ-ddFvPGb85cyuFs",
    authDomain: "mommys-little-secrets.firebaseapp.com",
    projectId: "mommys-little-secrets",
    storageBucket: "mommys-little-secrets.firebasestorage.app",
    messagingSenderId: "347227983313",
    appId: "1:347227983313:web:8646fc8b10ceb68d13a4f0",
    measurementId: "G-SK1TQNR5QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);    // Für Passwort-Login
const db = getFirestore(app); // Für die Datenbank

_____________________________________

// Login-Funktion
// Login-Funktion
function checkPassword() {
    const HARDCODED_EMAIL = "admin@mommys-secrets.com";
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, HARDCODED_EMAIL, password)
        .then(() => {
            // Erfolg: Admin-Panel anzeigen
            document.getElementById("admin-bereich").style.display = "block";
            console.log("Login erfolgreich!"); // Für Debugging
        })
        .catch((error) => {
            alert("Wrong Password!");
            console.error("Login error:", error); // Zeigt detaillierte Fehler
        });
}

_____________________________________

// Funktionen zum Aktualisieren der Inhalte
async function updateMudeaAlert() {
    const text = document.getElementById('mudeainfos').value;
    await saveToFirestore('mudea', text);
}

async function updateSpoticordAlter() {
    const text = document.getElementById('spoticordInfos').value;
    await saveToFirestore('spoticord', text);
}

async function updateMovieAlert() {
    const text = document.getElementById('movieinfos').value;
    await saveToFirestore('movietime', text);
}

async function updateEventsAlert() {
    const text = document.getElementById('eventinfos').value;
    await saveToFirestore('events', text);
}

// Allgemeine Funktion zum Speichern in Firestore
async function saveToFirestore(docName, text) {
    try {
        await setDoc(doc(db, "updates", docName), {
            text: text,
            timestamp: new Date()
        });
        alert(`${docName} update erfolgreich gespeichert!`);
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        alert("Fehler beim Speichern!");
    }
}

// Inhalte beim Laden der Seite anzeigen
async function loadContent() {
    const sections = ['mudea', 'spoticord', 'movietime', 'events'];

    for (const section of sections) {
        const docSnap = await getDoc(doc(db, "updates", section));
        if (docSnap.exists()) {
            document.getElementById(`${section}infos`).value = docSnap.data().text || '';
        }
    }
}

// Beim Start Inhalte laden
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
});

console.log("Script loaded!");  // Check if this appears in browser console (F12)