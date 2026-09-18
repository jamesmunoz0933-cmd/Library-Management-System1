// ==========================================
// FATHER BORROMEO LIBRARY
// FIREBASE BOOK SYSTEM
// AUTOMATIC CATEGORY FROM LOCATION
// ==========================================

import { db } from "./firebase.js";

import {
    ref,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// ==========================================
// HTML ELEMENTS
// ==========================================

const bookList = document.getElementById("book-list");
const searchInput = document.getElementById("searchInput");


// ==========================================
// BOOK DATA
// ==========================================

let books = [];


// ==========================================
// GET CATEGORY FROM FIREBASE LOCATION
// ==========================================

function getCategory(location) {

    const value = String(location || "")
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();


    // BIBLICAL STUDIES
    if (
        value === "BIBLICAL STUDIES" ||
        value === "BIBLICAL STUDIES LIB 2 (DUPLICATE COPIES)"
    ) {
        return "BIBLICAL STUDIES";
    }


    // FICTION
    if (value === "FICTION") {
        return "FICTION";
    }


    // FILIPINIANA
    if (
        value === "FILIPINIANA" ||
        value === "FILIPINIANA (LIBRARY 2)" ||
        value === "FILIPINIANA (DUPLICATE COPIES)" ||
        value === "FILIPIANA"
    ) {
        return "FILIPINIANA";
    }


    // GENERAL REFERENCE
    if (
        value === "GENERAL REFERENCE" ||
        value === "GEN-REF2"
    ) {
        return "GENERAL REFERENCE";
    }


    // PAPAL COLLECTION
    if (
        value === "PAPAL COLLECTION" ||
        value === "PAPAL CPLLECTION (DUPLICATE COPIES)"
    ) {
        return "PAPAL COLLECTION";
    }


    // PERIODICAL
    if (
        value === "PERIODICAL" ||
        value === "PERIODICAL LIB2 (DUPLICATE COPIES)"
    ) {
        return "PERIODICAL";
    }


    // REFERENCE
    if (
        value === "REFERENCE" ||
        value === "REFERENCE (LIBRARY 2)"
    ) {
        return "REFERENCE";
    }


    // SPECIAL COLLECTION
    if (
        value === "SPECIAL COLLECTION" ||
        value === "SPECIAL COLLECTION LIB 2"
    ) {
        return "SPECIAL COLLECTION";
    }


    // SPIRITUALITY
    if (
        value === "SPIRITUALITY" ||
        value === "SPIRITUALITY LIBRARY 2 (DUPLICATE COPIES)"
    ) {
        return "SPIRITUALITY";
    }


    // THEOLOGY
    if (
        value === "THEOLOGY" ||
        value === "THEOLOGY (DUPLICATE COPIES)"
    ) {
        return "THEOLOGY";
    }


    // VERTICAL FILE
    if (value === "VERTICAL FILE") {
        return "VERTICAL FILE";
    }


    // BOOKLET
    if (value === "BOOKLET") {
        return "BOOKLET";
    }


    return "";
}


// ==========================================
// GET CATEGORY FROM URL
// ==========================================

function getSelectedCategory() {

    const params = new URLSearchParams(
        window.location.search
    );

    return (
        params.get("category") || ""
    )
        .trim()
        .toUpperCase();
}


// ==========================================
// SORT BOOKS
// NUMBERS → A-Z → QUOTATION MARKS LAST
// ==========================================

function sortBooks(bookData) {

    return [...bookData].sort(function (a, b) {

        const titleA = a.title.trim();
        const titleB = b.title.trim();


        // Quotation marks always last

        const quoteA =
            titleA.startsWith('"');

        const quoteB =
            titleB.startsWith('"');


        if (quoteA && !quoteB) {
            return 1;
        }

        if (!quoteA && quoteB) {
            return -1;
        }


        // Numbers first

        const numberA =
            /^\d/.test(titleA);

        const numberB =
            /^\d/.test(titleB);


        if (numberA && !numberB) {
            return -1;
        }

        if (!numberA && numberB) {
            return 1;
        }


        // A-Z

        return titleA.localeCompare(
            titleB,
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );

    });
}


// ==========================================
// LOAD BOOKS FROM FIREBASE
// ==========================================

async function loadBooks() {

    try {

        console.log(
            "Loading books from Firebase..."
        );


        if (!bookList) {

            console.error(
                "book-list element not found."
            );

            return;
        }


        bookList.innerHTML = `
            <tr>
                <td colspan="8">
                    Loading books...
                </td>
            </tr>
        `;


        // Firebase ROOT

        const booksRef = ref(db);

        const snapshot = await get(
            booksRef
        );


        // ======================================
        // NO BOOKS
        // ======================================

        if (!snapshot.exists()) {

            bookList.innerHTML = `
                <tr>
                    <td colspan="8">
                        No books found.
                    </td>
                </tr>
            `;

            return;
        }


        const data = snapshot.val();

        books = [];


        // ======================================
        // CONVERT FIREBASE DATA
        // ======================================

        Object.keys(data).forEach(
            function (id) {

                const book = data[id];


                // Ignore non-book data

                if (
                    !book ||
                    typeof book !== "object" ||
                    !book.title
                ) {
                    return;
                }


                // Original Firebase location

                const location = String(
                    book.location || ""
                );


                // Automatically determine category

                const category =
                    getCategory(location);


                books.push({

                    id: id,

                    record: String(
                        book.record || ""
                    ),

                    callNumber: String(
                        book.callNumber || ""
                    ),

                    author: String(
                        book.author || ""
                    ),

                    title: String(
                        book.title || ""
                    ),

                    copyright: String(
                        book.copyright || ""
                    ),

                    location: location,

                    category: category,

                    available:
                        book.available === true

                });

            }
        );


        console.log(
            "Books loaded:",
            books.length
        );


        // ======================================
        // GET SELECTED CATEGORY
        // ======================================

        const selectedCategory =
            getSelectedCategory();


        console.log(
            "Selected category:",
            selectedCategory
        );


        // ======================================
        // FILTER CATEGORY
        // ======================================

        if (selectedCategory !== "") {

            const filteredBooks =
                books.filter(
                    function (book) {

                        return (
                            book.category ===
                            selectedCategory
                        );

                    }
                );


            console.log(
                "Books in category:",
                filteredBooks.length
            );


            displayBooks(
                sortBooks(filteredBooks)
            );

        } else {

            // Show all books

            displayBooks(
                sortBooks(books)
            );

        }

    } catch (error) {

        console.error(
            "Firebase error:",
            error
        );


        if (bookList) {

            bookList.innerHTML = `
                <tr>
                    <td colspan="8">
                        Failed to load books.
                    </td>
                </tr>
            `;

        }

    }

}


// ==========================================
// DISPLAY BOOKS
// ==========================================

function displayBooks(bookData) {

    if (!bookList) {
        return;
    }


    // ======================================
    // NO BOOKS
    // ======================================

    if (bookData.length === 0) {

        bookList.innerHTML = `
            <tr>
                <td colspan="8">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    let rows = "";


    // ======================================
    // CREATE BOOK ROWS
    // ======================================

    bookData.forEach(
        function (book) {


            // ==================================
            // STATUS
            // ==================================

            const status =
                book.available
                    ? "🟢 Available"
                    : "🔴 Borrowed";


            // ==================================
            // BORROW ACTION
            // ==================================

            let action;


            if (book.available) {

                action = `
                    <button
                        class="borrow-btn"
                        onclick="borrowBook('${escapeQuotes(book.id)}')"
                    >
                        Borrow
                    </button>
                `;

            } else {

                action = `
                    <button
                        class="borrow-btn"
                        disabled
                    >
                        Borrowed
                    </button>
                `;

            }


            // ==================================
            // TABLE ROW
            // ==================================

            rows += `
                <tr>

                    <td>
                        ${escapeHTML(book.record)}
                    </td>

                    <td>
                        ${escapeHTML(book.callNumber)}
                    </td>

                    <td>
                        ${escapeHTML(book.author)}
                    </td>

                    <td>
                        ${escapeHTML(book.title)}
                    </td>

                    <td>
                        ${escapeHTML(book.copyright)}
                    </td>

                    <td>
                        ${escapeHTML(book.location)}
                    </td>

                    <td>
                        ${status}
                    </td>

                    <td>
                        ${action}
                    </td>

                </tr>
            `;

        }
    );


    // Display rows

    bookList.innerHTML = rows;

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            const searchValue =
                this.value
                    .toLowerCase()
                    .trim();


            // Get current category

            const selectedCategory =
                getSelectedCategory();


            // ==================================
            // FILTER BOOKS
            // ==================================

            const filteredBooks =
                books.filter(
                    function (book) {


                        // ==========================
                        // SEARCH MATCH
                        // ==========================

                        const matchesSearch =

                            searchValue === "" ||

                            book.title
                                .toLowerCase()
                                .includes(
                                    searchValue
                                ) ||

                            book.author
                                .toLowerCase()
                                .includes(
                                    searchValue
                                ) ||

                            book.callNumber
                                .toLowerCase()
                                .includes(
                                    searchValue
                                ) ||

                            book.record
                                .toLowerCase()
                                .includes(
                                    searchValue
                                ) ||

                            book.location
                                .toLowerCase()
                                .includes(
                                    searchValue
                                );


                        // ==========================
                        // CATEGORY MATCH
                        // ==========================

                        const matchesCategory =

                            selectedCategory === "" ||

                            book.category ===
                            selectedCategory;


                        return (
                            matchesSearch &&
                            matchesCategory
                        );

                    }
                );


            // Display sorted results

            displayBooks(
                sortBooks(filteredBooks)
            );

        }
    );

}


// ==========================================
// BORROW BUTTON
// ORIGINAL SYSTEM - DO NOT CHANGE
// ==========================================

window.borrowBook = function (bookID) {

    window.location.href =
        "borrow.html?book=" +
        encodeURIComponent(bookID);

};


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

loadBooks();