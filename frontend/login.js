// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:5000/api";


// ==========================================
// DOM ELEMENTS
// ==========================================

const loginForm =
    document.getElementById("loginForm");

const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginMessage =
    document.getElementById("loginMessage");


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==========================================
        // GET VALUES
        // ==========================================

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        // ==========================================
        // CLEAR OLD MESSAGE
        // ==========================================

        loginMessage.textContent = "";

        loginMessage.style.color = "";


        try {

            // ==========================================
            // LOGIN REQUEST
            // ==========================================

            const response =
                await fetch(
                    `${API_URL}/auth/login`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                password
                            })

                    }
                );


            const data =
                await response.json();


            // ==========================================
            // LOGIN SUCCESS
            // ==========================================

            if (data.success) {


                // ==========================================
                // SAVE TOKEN
                // ==========================================

                localStorage.setItem(
                    "token",
                    data.token
                );


                // ==========================================
                // SAVE USER
                // ==========================================

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                // ==========================================
                // SUCCESS MESSAGE
                // ==========================================

                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "green";


                // ==========================================
                // ROLE BASED REDIRECT
                // ==========================================

                setTimeout(
                    function () {

                        // ADMIN
                        if (
                            data.user.role === "admin"
                        ) {

                            window.location.href =
                                "index.html";

                        }

                        // EMPLOYEE
                        else if (
                            data.user.role === "employee"
                        ) {

                            window.location.href =
                                "employees.html";

                        }

                        // UNKNOWN ROLE
                        else {

                            alert(
                                "Invalid user role."
                            );

                        }

                    },
                    800
                );


            } else {


                // ==========================================
                // LOGIN FAILED
                // ==========================================

                loginMessage.textContent =
                    data.message ||
                    "Invalid email or password";

                loginMessage.style.color =
                    "red";

            }


        } catch (error) {

            // ==========================================
            // SERVER ERROR
            // ==========================================

            console.error(
                "Login error:",
                error
            );


            loginMessage.textContent =
                "Unable to connect to server.";

            loginMessage.style.color =
                "red";

        }

    }
);