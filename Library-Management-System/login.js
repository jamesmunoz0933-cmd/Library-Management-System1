// ==========================================
// FATHER BORROMEO LIBRARY
// ADMIN PIN LOGIN
// ==========================================


// ==========================================
// ADMIN PIN
// ==========================================

// CHANGE THIS PIN IF YOU WANT
const ADMIN_PIN = "097507";


// ==========================================
// HTML ELEMENTS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const pinInput =
    document.getElementById("pin");

const loginMessage =
    document.getElementById("loginMessage");


// ==========================================
// CHECK LOGIN FORM
// ==========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const enteredPIN =
                pinInput.value.trim();


            // ======================================
            // CHECK PIN
            // ======================================

            if (enteredPIN === ADMIN_PIN) {


                // Save admin login
                sessionStorage.setItem(
                    "adminLoggedIn",
                    "true"
                );


                loginMessage.style.display =
                    "block";

                loginMessage.textContent =
                    "✅ Login successful!";


                // Open dashboard

                setTimeout(
                    function () {

                        window.location.href =
                            "admin.html";

                    },
                    500
                );


            } else {


                loginMessage.style.display =
                    "block";

                loginMessage.textContent =
                    "❌ Incorrect PIN.";


                // Clear PIN

                pinInput.value = "";


                pinInput.focus();

            }

        }
    );

}