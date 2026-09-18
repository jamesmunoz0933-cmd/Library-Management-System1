// ==========================================
// FATHER BORROMEO LIBRARY
// RETURNED BOOKS HISTORY
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const returnedList =
    document.getElementById("returned-list");

const searchInput =
    document.getElementById("searchReturned");


// ==========================================
// DATA
// ==========================================

let returnedBooks = [];


// ==========================================
// LOAD RETURNED BOOKS
// ==========================================

async function loadReturnedBooks() {

    try {

        returnedList.innerHTML = `
            <tr>
                <td colspan="7">
                    📚 Loading returned books...
                </td>
            </tr>
        `;


        const returnedRef =
            ref(db, "borrowRecords");


        const snapshot =
            await get(returnedRef);


        if (!snapshot.exists()) {

            showEmpty();

            return;

        }


        const data =
            snapshot.val();


        returnedBooks = [];


        // ======================================
        // GET RETURNED RECORDS ONLY
        // ======================================

        Object.keys(data).forEach((id) => {

            const record =
                data[id];


            if (!record) {
                return;
            }


            if (
                record.status === "Returned" &&
                record.returned === true
            ) {

                returnedBooks.push({

                    id: id,

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

                    returnedDate:
                        String(
                            record.returnedDate || ""
                        )

                });

            }

        });


        displayReturnedBooks(
            returnedBooks
        );


    } catch (error) {

        console.error(
            "❌ Error loading returned books:",
            error
        );


        returnedList.innerHTML = `
            <tr>
                <td colspan="7">
                    ❌ Failed to load returned books.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// DISPLAY RETURNED BOOKS
// ==========================================

function displayReturnedBooks(data) {


    if (data.length === 0) {

        showEmpty();

        return;

    }


    let rows = "";


    data.forEach((record) => {

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

                <td>
                    ${escapeHTML(
                        record.returnedDate
                    )}
                </td>

                <td>
                    🟢 Returned
                </td>

            </tr>

        `;

    });


    returnedList.innerHTML =
        rows;

}


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

            displayReturnedBooks(
                returnedBooks
            );

            return;

        }


        const filtered =
            returnedBooks.filter(
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


        displayReturnedBooks(
            filtered
        );

    }
);


// ==========================================
// EMPTY MESSAGE
// ==========================================

function showEmpty() {

    returnedList.innerHTML = `
        <tr>
            <td colspan="7">
                No returned books yet.
            </td>
        </tr>
    `;

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


// ==========================================
// START
// ==========================================

loadReturnedBooks();