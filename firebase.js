// ===============================
// FATHER BORROMEO LIBRARY
// FIREBASE CONFIGURATION
// ===============================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ===============================
// FIREBASE CONFIGURATION
// ===============================

const firebaseConfig = {

    apiKey: "AIzaSyCW5Ly775tH8I9-12MR1BNOXpYO7zDV__Q",

    authDomain:
        "father-borromeo-library.firebaseapp.com",

    databaseURL:
        "https://father-borromeo-library-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId:
        "father-borromeo-library",

    storageBucket:
        "father-borromeo-library.firebasestorage.app",

    messagingSenderId:
        "287195625925",

    appId:
        "1:287195625925:web:bf3bd96f252c0bfb16b3ac"

};


// ===============================
// INITIALIZE FIREBASE
// ===============================

const app =
    initializeApp(firebaseConfig);


// ===============================
// INITIALIZE REALTIME DATABASE
// ===============================

const db =
    getDatabase(app);


// ===============================
// EXPORT
// ===============================

export {
    app,
    db
};