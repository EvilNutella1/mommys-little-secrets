import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// --- Firebase configuration ---
const firebaseConfig = {
    apiKey: "AIzaSyCWZmXE8b3QFMSjQ_CQ-ddFvPGb85cyuFs",
    authDomain: "mommys-little-secrets.firebaseapp.com",
    projectId: "mommys-little-secrets",
    storageBucket: "mommys-little-secrets.appspot.com",
    messagingSenderId: "347227983313",
    appId: "1:347227983313:web:8646fc8b10ceb68d13a4f0",
    measurementId: "G-SK1TQNR5QX"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Firestore save helper ---
async function saveToFirestore(docName, text) {
    try {
        await setDoc(doc(db, "updates", docName), {
            text: text,
            timestamp: new Date()
        });
        alert(`${docName} update saved successfully!`);
    } catch (error) {
        console.error("Error saving:", error);
        alert("Error saving update!");
    }
}

// --- Firestore load helper (for admin panel inputs) ---
async function loadContent() {
    const sections = [
        { key: 'mudea', inputId: 'mudeainfos' },
        { key: 'spoticord', inputId: 'spoticordInfos' },
        { key: 'movietime', inputId: 'movieinfos' },
        { key: 'events', inputId: 'eventinfos' },
        { key: 'rules', inputId: 'rulesinfos' } // Added rules
    ];
    for (const section of sections) {
        const docSnap = await getDoc(doc(db, "updates", section.key));
        if (docSnap.exists()) {
            const input = document.getElementById(section.inputId);
            if (input) input.value = docSnap.data().text || '';
        }
    }
}

// --- Admin login ---
function handlePasswordLogin() {
    const passwordInput = document.getElementById("password");
    const adminSection = document.getElementById("admin-bereich");
    if (!passwordInput || !adminSection) return;

    const password = passwordInput.value;
    const HARDCODED_EMAIL = "admin@mommys-secrets.com";

    signInWithEmailAndPassword(auth, HARDCODED_EMAIL, password)
        .then(() => {
            adminSection.style.display = "block";
            alert("✔️ Login successful!");
        })
        .catch((error) => {
            alert("❌ Wrong password!");
            console.error("Login error:", error);
        });
}

// --- Live listeners for all alert links ---
function setupLiveAlerts() {
    // Mapping: Firestore doc name <-> link ID
    const alertLinks = [
        { docName: 'mudea', linkId: 'mudea-alert' },
        { docName: 'spoticord', linkId: 'spoticord-alert' },
        { docName: 'movietime', linkId: 'movie-alert' },
        { docName: 'events', linkId: 'events-alert' },
        { docName: 'rules', linkId: 'rules-alert' } // Added rules
    ];

    alertLinks.forEach(({ docName, linkId }) => {
        const linkElem = document.getElementById(linkId);
        if (!linkElem) return;
        const docRef = doc(db, "updates", docName);

        // Store the current text in closure for the click handler
        let currentText = "";

        // Live update from Firestore
        onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                currentText = docSnap.data().text || '';
                linkElem.title = currentText;
            } else {
                currentText = "";
                linkElem.removeAttribute('title');
            }
        });

        // Click handler for alert
        linkElem.addEventListener('click', function(event) {
            event.preventDefault();
            if (currentText) {
                alert(currentText);
            } else {
                alert("No update available.");
            }
        });
    });
}

// --- Set up event listeners when DOM is loaded ---
document.addEventListener('DOMContentLoaded', () => {
    // Contact link
    const contactLink = document.getElementById('contact');
    if (contactLink) {
        contactLink.addEventListener('click', function(event) {
            event.preventDefault();
            alert('If you have questions or helpful requests about this website,\nplease contact me via Discord:\n✉ Veganlife\n\nor via Instagram:\n✉ EvilNutellaaa');
        });
    }

    // Admin login
    const verifyBtn = document.getElementById('verify-button');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', handlePasswordLogin);
    }

    // Admin panel: Save alerts
    const mudeaBtn = document.getElementById('mudea-save');
    if (mudeaBtn) {
        mudeaBtn.addEventListener('click', () => {
            const text = document.getElementById('mudeainfos').value;
            saveToFirestore('mudea', text);
        });
    }

    const spoticordBtn = document.getElementById('spoticord-save');
    if (spoticordBtn) {
        spoticordBtn.addEventListener('click', () => {
            const text = document.getElementById('spoticordInfos').value;
            saveToFirestore('spoticord', text);
        });
    }

    const movieBtn = document.getElementById('movie-save');
    if (movieBtn) {
        movieBtn.addEventListener('click', () => {
            const text = document.getElementById('movieinfos').value;
            saveToFirestore('movietime', text);
        });
    }

    const eventsBtn = document.getElementById('events-save');
    if (eventsBtn) {
        eventsBtn.addEventListener('click', () => {
            const text = document.getElementById('eventinfos').value;
            saveToFirestore('events', text);
        });
    }

    // Admin panel: Save rules
    const rulesBtn = document.getElementById('rules-save');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', () => {
            const text = document.getElementById('rulesinfos').value;
            saveToFirestore('rules', text);
        });
    }

    // Load content from Firestore (for admin panel inputs)
    loadContent();

    // Activate live listeners for all alert links
    setupLiveAlerts();

    // Debug output
    console.log("mommys-little-secrets.js (module) loaded successfully!");
});
