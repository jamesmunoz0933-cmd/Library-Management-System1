// ==========================================
// FATHER BORROMEO LIBRARY
// ADMIN DASHBOARD
// ==========================================


// ==========================================
// ADMIN PROTECTION
// ==========================================

const adminLoggedIn =
    sessionStorage.getItem("adminLoggedIn");


if (adminLoggedIn !== "true") {

    window.location.href =
        "login.html";

}


// ==========================================
// FIREBASE
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const totalBooks =
    document.getElementById("totalBooks");

const availableBooks =
    document.getElementById("availableBooks");

const borrowedBooks =
    document.getElementById("borrowedBooks");

const returnedBooks =
    document.getElementById("returnedBooks");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// LOAD DASHBOARD
// ==========================================

async function loadDashboard() {

    try {

        console.log("📊 Loading dashboard...");


        // ======================================
        // LOAD BOOKS
        // ======================================

        const booksRef =
            ref(db);

        const booksSnapshot =
            await get(booksRef);


        let total = 0;
        let available = 0;
        let borrowed = 0;


        if (booksSnapshot.exists()) {

            const data =
                booksSnapshot.val();


            Object.keys(data).forEach((id) => {

                const book =
                    data[id];


                // Ignore non-book records

                if (
                    !book ||
                    typeof book !== "object" ||
                    !book.title
                ) {

                    return;

                }


                total++;


                if (
                    book.available === true
                ) {

                    available++;

                } else {

                    borrowed++;

                }

            });

        }


        // ======================================
        // LOAD RETURNED RECORDS
        // ======================================

        const borrowRef =
            ref(
                db,
                "borrowRecords"
            );

        const borrowSnapshot =
            await get(borrowRef);


        let returned = 0;


        if (borrowSnapshot.exists()) {

            const borrowData =
                borrowSnapshot.val();


            Object.keys(
                borrowData
            ).forEach((id) => {

                const record =
                    borrowData[id];


                if (
                    record &&
                    record.status === "Returned"
                ) {

                    returned++;

                }

            });

        }


        // ======================================
        // DISPLAY NUMBERS
        // ======================================

        totalBooks.textContent =
            total.toLocaleString();


        availableBooks.textContent =
            available.toLocaleString();


        borrowedBooks.textContent =
            borrowed.toLocaleString();


        returnedBooks.textContent =
            returned.toLocaleString();


        console.log(
            "✅ Dashboard loaded:",
            {
                total,
                available,
                borrowed,
                returned
            }
        );


    } catch (error) {

        console.error(
            "❌ Dashboard error:",
            error
        );


        totalBooks.textContent =
            "Error";

        availableBooks.textContent =
            "Error";

        borrowedBooks.textContent =
            "Error";

        returnedBooks.textContent =
            "Error";

    }

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {


            // Remove admin session

            sessionStorage.removeItem(
                "adminLoggedIn"
            );


            // Return to login

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// START
// ==========================================

loadDashboard();