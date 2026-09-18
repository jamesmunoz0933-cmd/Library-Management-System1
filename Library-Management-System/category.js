/* ==========================================
   FATHER BORROMEO LIBRARY
   EXCEL CATEGORY SYSTEM
========================================== */


// ===============================
// CATEGORY INFORMATION
// ===============================

const categories = {

    "biblical-studies": {

        name: "Biblical Studies",

        file: "biblical-studies.xlsx",

        description:
            "Books about Scripture, Bible interpretation, and biblical research."

    },


    "filipiniana": {

        name: "Filipiniana",

        file: "filipiniana.xlsx",

        description:
            "Books about Philippine culture, history, literature, and heritage."

    },


    "fiction": {

        name: "Fiction",

        file: "fiction.xlsx",

        description:
            "Novels, stories, and literary works for reading and enjoyment."

    },


    "general-reference": {

        name: "General Reference",

        file: "general-reference.xlsx",

        description:
            "General knowledge resources and informational materials."

    },


    "papal-collection": {

        name: "Papal Collection",

        file: "papal-collection.xlsx",

        description:
            "Books and materials related to the papacy, popes, and Catholic Church."

    },


    "periodical": {

        name: "Periodical",

        file: "periodical.xlsx",

        description:
            "Journals, magazines, newsletters, and regular publications."

    },


    "reference": {

        name: "Reference",

        file: "reference.xlsx",

        description:
            "Dictionaries, encyclopedias, manuals, and research materials."

    },


    "special-collection": {

        name: "Special Collection",

        file: "special-collection.xlsx",

        description:
            "Rare, valuable, and selected materials preserved by the library."

    },


    "spirituality": {

        name: "Spirituality",

        file: "spirituality.xlsx",

        description:
            "Books about prayer, spiritual growth, reflection, and spiritual formation."

    },


    "theology": {

        name: "Theology",

        file: "theology.xlsx",

        description:
            "Books about Catholic teachings, doctrine, faith, and theological studies."

    },


    "vertical-file": {

        name: "Vertical File",

        file: "vertical-file.xlsx",

        description:
            "Articles, pamphlets, documents, clippings, and special information files."

    }

};


// ===============================
// GET CATEGORY FROM URL
// ===============================

const urlParams = new URLSearchParams(
    window.location.search
);

const categoryKey =
    urlParams.get("category");


// ===============================
// HTML ELEMENTS
// ===============================

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryDescription =
    document.getElementById("categoryDescription");

const bookTable =
    document.getElementById("bookTable");

const loading =
    document.getElementById("loading");

const noResult =
    document.getElementById("no-result");

const searchInput =
    document.getElementById("searchInput");


// ===============================
// CHECK CATEGORY
// ===============================

if (!categoryKey || !categories[categoryKey]) {

    categoryTitle.textContent =
        "Library Collections";

    categoryDescription.textContent =
        "Please select a library category.";

    loading.style.display = "none";

    noResult.style.display = "none";

} else {

    loadCategory(
        categories[categoryKey]
    );

}


// ===============================
// LOAD EXCEL
// ===============================

let allBooks = [];


async function loadCategory(category) {

    categoryTitle.textContent =
        category.name;

    categoryDescription.textContent =
        category.description;


    try {

        const response =
            await fetch(category.file);


        if (!response.ok) {

            throw new Error(
                "Excel file not found: " +
                category.file
            );

        }


        const arrayBuffer =
            await response.arrayBuffer();


        const workbook =
            XLSX.read(
                arrayBuffer,
                {
                    type: "array"
                }
            );


        // Get first sheet

        const sheetName =
            workbook.SheetNames[0];


        const worksheet =
            workbook.Sheets[sheetName];


        // Convert Excel to JSON

        const data =
            XLSX.utils.sheet_to_json(
                worksheet,
                {
                    defval: ""
                }
            );


        allBooks = data;


        // ===============================
        // SORT BY TITLE
        // ===============================

        allBooks.sort(
            function(a, b) {

                const titleA =
                    String(
                        a["TITLE"] ||
                        a["Title"] ||
                        ""
                    ).toLowerCase();

                const titleB =
                    String(
                        b["TITLE"] ||
                        b["Title"] ||
                        ""
                    ).toLowerCase();


                return titleA.localeCompare(
                    titleB
                );

            }
        );


        loading.style.display =
            "none";


        displayBooks(allBooks);


    } catch (error) {

        console.error(error);


        loading.textContent =
            "Unable to load the Excel file.";


        loading.style.color =
            "red";


        noResult.style.display =
            "none";

    }

}


// ===============================
// DISPLAY BOOKS
// ===============================

function displayBooks(books) {

    bookTable.innerHTML = "";


    if (books.length === 0) {

        noResult.style.display =
            "block";

        return;

    }


    noResult.style.display =
        "none";


    books.forEach(
        function(book) {


            const row =
                document.createElement("tr");


            const recordNumber =
                getValue(
                    book,
                    "RECORD NUMBER",
                    "Record Number",
                    "RECORD_NUMBER"
                );


            const callNumber =
                getValue(
                    book,
                    "CALL NUMBER",
                    "Call Number",
                    "CALL_NUMBER"
                );


            const author =
                getValue(
                    book,
                    "AUTHOR",
                    "Author"
                );


            const title =
                getValue(
                    book,
                    "TITLE",
                    "Title"
                );


            const copyright =
                getValue(
                    book,
                    "COPYRIGHT",
                    "Copyright",
                    "COPY RIGHT"
                );


            const location =
                getValue(
                    book,
                    "LOCATION",
                    "Location"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(recordNumber)}
                </td>

                <td>
                    ${escapeHTML(callNumber)}
                </td>

                <td>
                    ${escapeHTML(author)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(title)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(copyright)}
                </td>

                <td>
                    ${escapeHTML(location)}
                </td>

            `;


            bookTable.appendChild(row);

        }
    );

}


// ===============================
// GET EXCEL VALUE
// ===============================

function getValue(
    book,
    ...possibleNames
) {

    for (
        const name of possibleNames
    ) {

        if (
            book[name] !== undefined &&
            book[name] !== null
        ) {

            return String(
                book[name]
            );

        }

    }


    // Check case-insensitive

    const keys =
        Object.keys(book);


    for (
        const name of possibleNames
    ) {

        const found =
            keys.find(
                key =>
                    key.trim().toLowerCase() ===
                    name.trim().toLowerCase()
            );


        if (found) {

            return String(
                book[found]
            );

        }

    }


    return "";

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        const search =
            searchInput.value
                .toLowerCase()
                .trim();


        if (!search) {

            displayBooks(
                allBooks
            );

            return;

        }


        const filtered =
            allBooks.filter(
                function(book) {

                    return Object.values(book)
                        .join(" ")
                        .toLowerCase()
                        .includes(search);

                }
            );


        displayBooks(
            filtered
        );

    }
);


// ===============================
// SECURITY
// ===============================

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