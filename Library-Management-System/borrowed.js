// ==========================================
// FATHER BORROMEO LIBRARY
// BORROWED BOOKS SYSTEM
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const borrowedList =
    document.getElementById("borrowed-list");

const searchInput =
    document.getElementById("searchBorrowed");


// ==========================================
// DATA
// ==========================================

let borrowedBooks = [];


// ==========================================
// LOAD BORROWED BOOKS
// ==========================================

async function loadBorrowedBooks() {

    try {

        borrowedList.innerHTML = `
            <tr>
                <td colspan="7">
                    📚 Loading borrowed books...
                </td>
            </tr>
        `;


        const borrowRef =
            ref(db, "borrowRecords");

        const snapshot =
            await get(borrowRef);


        if (!snapshot.exists()) {

            borrowedList.innerHTML = `
                <tr>
                    <td colspan="7">
                        No borrowed books.
                    </td>
                </tr>
            `;

            return;
        }


        const data =
            snapshot.val();


        borrowedBooks = [];


        // ======================================
        // GET ONLY CURRENTLY BORROWED BOOKS
        // ======================================

        Object.keys(data).forEach((id) => {

            const record =
                data[id];


            if (!record) {
                return;
            }


            if (
                record.status === "Approved" &&
                record.returned === false
            ) {

                borrowedBooks.push({

                    id: id,

                    bookID:
                        String(
                            record.bookID || ""
                        ),

                    bookTitle:
                        String(
                            record.bookTitle || ""
                        ),

                    borrowerName:
                        String(
                            record.borrowerName || ""
                        ),

                    contact:
                        String(
                            record.contact || ""
                        ),

                    borrowDate:
                        String(
                            record.borrowDate || ""
                        ),

                    dueDate:
                        String(
                            record.dueDate || ""
                        ),

                    status:
                        String(
                            record.status || ""
                        )

                });

            }

        });


        // ======================================
        // DISPLAY
        // ======================================

        displayBorrowedBooks(
            borrowedBooks
        );


    } catch (error) {

        console.error(
            "❌ Error loading borrowed books:",
            error
        );


        borrowedList.innerHTML = `
            <tr>
                <td colspan="7">
                    ❌ Failed to load borrowed books.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// GET DUE STATUS
// ==========================================

function getDueStatus(dueDate) {

    // ======================================
    // NO DUE DATE
    // ======================================

    if (!dueDate) {

        return {

            text:
                "🔴 No Due Date",

            className:
                "overdue"

        };

    }


    // ======================================
    // TODAY
    // ======================================

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    // ======================================
    // DUE DATE
    // ======================================

    const due =
        new Date(
            dueDate + "T00:00:00"
        );

    due.setHours(
        0,
        0,
        0,
        0
    );


    // ======================================
    // CALCULATE DIFFERENCE
    // ======================================

    const difference =
        Math.round(
            (
                due.getTime() -
                today.getTime()
            ) /
            (1000 * 60 * 60 * 24)
        );


    // ======================================
    // OVERDUE
    // ======================================

    if (difference < 0) {

        const overdueDays =
            Math.abs(
                difference
            );


        return {

            text:
                `🔴 Overdue by ${overdueDays} ${
                    overdueDays === 1
                        ? "day"
                        : "days"
                }`,

            className:
                "overdue"

        };

    }


    // ======================================
    // DUE TODAY
    // ======================================

    if (difference === 0) {

        return {

            text:
                "🔴 Due today",

            className:
                "overdue"

        };

    }


    // ======================================
    // DAYS LEFT
    // ======================================

    return {

        text:
            `🟢 ${difference} ${
                difference === 1
                    ? "day"
                    : "days"
            } left`,

        className:
            difference <= 2
                ? "due-soon"
                : "on-time"

    };

}


// ==========================================
// DISPLAY BORROWED BOOKS
// ==========================================

function displayBorrowedBooks(data) {


    if (data.length === 0) {

        borrowedList.innerHTML = `
            <tr>
                <td colspan="7">
                    No borrowed books.
                </td>
            </tr>
        `;

        return;
    }


    let rows = "";


    data.forEach((record) => {


        // Get automatic due status

        const dueStatus =
            getDueStatus(
                record.dueDate
            );


        rows += `

            <tr>

                <td>
                    ${escapeHTML(
                        record.bookTitle
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.borrowerName
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.contact
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.borrowDate
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.dueDate
                    )}
                </td>

                <td
                    class="${dueStatus.className}"
                >
                    ${dueStatus.text}
                </td>

                <td>

                    <button
                        class="borrow-btn"
                        onclick="returnBook(
                            '${escapeQuotes(record.id)}',
                            '${escapeQuotes(record.bookID)}'
                        )"
                    >
                        Return
                    </button>

                </td>

            </tr>

        `;

    });


    borrowedList.innerHTML =
        rows;

}


// ==========================================
// RETURN BOOK
// ==========================================

window.returnBook = async function(
    borrowID,
    bookID
) {


    const confirmReturn =
        confirm(
            "Are you sure you want to return this book?"
        );


    if (!confirmReturn) {
        return;
    }


    try {


        // ==================================
        // UPDATE BORROW RECORD
        // ==================================

        const borrowRef =
            ref(
                db,
                "borrowRecords/" +
                borrowID
            );


        await update(
            borrowRef,
            {

                status: "Returned",

                returned: true,

                returnedDate:
                    getToday()

            }
        );


        // ==================================
        // UPDATE BOOK
        // ==================================

        const bookRef =
            ref(
                db,
                bookID
            );


        await update(
            bookRef,
            {

                available: true

            }
        );


        alert(
            "✅ Book returned successfully!"
        );


        // Reload table

        loadBorrowedBooks();


    } catch (error) {

        console.error(
            "❌ Return error:",
            error
        );


        alert(
            "❌ Failed to return book.\n\n" +
            error.message
        );

    }

};


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function () {


        const value =
            this.value
                .toLowerCase()
                .trim();


        if (value === "") {

            displayBorrowedBooks(
                borrowedBooks
            );

            return;
        }


        const filtered =
            borrowedBooks.filter(
                (record) => {


                    return (

                        record.bookTitle
                            .toLowerCase()
                            .includes(value)

                        ||

                        record.borrowerName
                            .toLowerCase()
                            .includes(value)

                        ||

                        record.contact
                            .toLowerCase()
                            .includes(value)

                    );

                }
            );


        displayBorrowedBooks(
            filtered
        );

    }
);


// ==========================================
// TODAY'S DATE
// ==========================================

function getToday() {

    const date =
        new Date();


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
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeQuotes(value) {

    return String(value)

        .replace(
            /\\/g,
            "\\\\"
        )

        .replace(
            /'/g,
            "\\'"
        );

}


// ==========================================
// START
// ==========================================

loadBorrowedBooks();