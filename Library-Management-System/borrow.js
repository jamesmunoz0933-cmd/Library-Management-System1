// ==========================================
// FATHER BORROMEO LIBRARY
// BORROW SYSTEM
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get,
    update,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const borrowForm =
    document.getElementById("borrowForm");

const bookTitle =
    document.getElementById("bookTitle");

const borrowerName =
    document.getElementById("borrowerName");

const contact =
    document.getElementById("contact");

const borrowDate =
    document.getElementById("borrowDate");

const dueDate =
    document.getElementById("dueDate");


// ==========================================
// GET BOOK ID FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const bookID =
    urlParams.get("book");


// ==========================================
// CHECK BOOK ID
// ==========================================

if (!bookID) {

    alert("❌ No book selected.");

    window.location.href =
        "books.html";

}


// ==========================================
// DATE FUNCTION
// ==========================================

function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ==========================================
// SET BORROW DATE
// ==========================================

const today =
    new Date();


borrowDate.value =
    formatDate(today);


// ==========================================
// SET DUE DATE = 5 DAYS
// ==========================================

const due =
    new Date(today);


due.setDate(
    due.getDate() + 5
);


dueDate.value =
    formatDate(due);


// ==========================================
// LOAD SELECTED BOOK
// ==========================================

async function loadBook() {

    try {


        const bookRef =
            ref(
                db,
                bookID
            );


        const snapshot =
            await get(bookRef);


        if (!snapshot.exists()) {

            alert(
                "❌ Book not found."
            );

            window.location.href =
                "books.html";

            return;

        }


        const book =
            snapshot.val();


        // ==================================
        // CHECK AVAILABILITY
        // ==================================

        if (
            book.available !== true
        ) {

            alert(
                "❌ This book is already borrowed."
            );

            window.location.href =
                "books.html";

            return;

        }


        // ==================================
        // SHOW BOOK TITLE
        // ==================================

        bookTitle.value =
            book.title || "";


    } catch (error) {


        console.error(
            "Error loading book:",
            error
        );


        alert(
            "❌ Failed to load book."
        );

    }

}


// ==========================================
// SUBMIT BORROW FORM
// ==========================================

borrowForm.addEventListener(
    "submit",
    async function(event) {


        event.preventDefault();


        const name =
            borrowerName.value.trim();


        const phone =
            contact.value.trim();


        // ==================================
        // VALIDATION
        // ==================================

        if (!name) {

            alert(
                "Please enter your full name."
            );

            return;

        }


        if (!phone) {

            alert(
                "Please enter your contact number."
            );

            return;

        }


        try {


            // ==================================
            // CHECK BOOK AGAIN
            // ==================================

            const bookRef =
                ref(
                    db,
                    bookID
                );


            const bookSnapshot =
                await get(bookRef);


            if (
                !bookSnapshot.exists()
            ) {

                alert(
                    "❌ Book no longer exists."
                );

                return;

            }


            const book =
                bookSnapshot.val();


            // ==================================
            // CHECK IF ALREADY BORROWED
            // ==================================

            if (
                book.available !== true
            ) {

                alert(
                    "❌ Sorry, this book has already been borrowed."
                );

                return;

            }


            // ==================================
            // CREATE BORROW RECORD
            // ==================================

            const borrowRef =
                push(
                    ref(
                        db,
                        "borrowRecords"
                    )
                );


            const borrowID =
                borrowRef.key;


            const borrowData = {

                borrowID:

                    borrowID,

                bookID:

                    bookID,

                bookTitle:

                    book.title || "",

                borrowerName:

                    name,

                contact:

                    phone,

                borrowDate:

                    borrowDate.value,

                dueDate:

                    dueDate.value,

                status:

                    "Approved",

                returned:

                    false,

                createdAt:

                    new Date()
                        .toISOString()

            };


            // ==================================
            // SAVE BORROW RECORD
            // ==================================

            await set(
                borrowRef,
                borrowData
            );


            // ==================================
            // CHANGE BOOK STATUS
            // ==================================

            await update(
                bookRef,
                {
                    available: false
                }
            );


            // ==================================
            // SUCCESS
            // ==================================

            alert(
                "✅ Borrow successful!\n\n" +

                "Book: " +
                book.title +

                "\n\nBorrower: " +
                name +

                "\n\nDue Date: " +
                dueDate.value
            );


            // ==================================
            // RETURN TO BOOK LIST
            // ==================================

            window.location.href =
                "books.html";


        } catch (error) {


            console.error(
                "Borrow error:",
                error
            );


            alert(
                "❌ Failed to process borrow request.\n\n" +
                error.message
            );

        }

    }
);


// ==========================================
// START
// ==========================================

loadBook();