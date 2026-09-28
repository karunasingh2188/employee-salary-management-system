// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:5000/api";


// ==========================================
// DOM ELEMENTS
// ==========================================

const registerForm =
    document.getElementById("registerForm");

const registerName =
    document.getElementById("registerName");

const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const registerRole =
    document.getElementById("registerRole");

const registerMessage =
    document.getElementById("registerMessage");


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        // ==========================================
        // GET VALUES
        // ==========================================

        const name =
            registerName.value.trim();

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;

        const role =
            registerRole.value;


        // ==========================================
        // CLEAR MESSAGE
        // ==========================================

        registerMessage.textContent = "";

        registerMessage.style.color = "";


        try {

            // ==========================================
            // REGISTER REQUEST
            // ==========================================

            const response =
                await fetch(
                    `${API_URL}/auth/register`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify({

                                name,

                                email,

                                password,

                                role

                            })

                    }
                );


            const data =
                await response.json();


            // ==========================================
            // SUCCESS
            // ==========================================

            if (data.success) {

                registerMessage.textContent =
                    "Registration successful!";

                registerMessage.style.color =
                    "green";


                // Clear form

                registerForm.reset();


                // Go to login

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1000
                );


            } else {

                registerMessage.textContent =
                    data.message ||
                    "Registration failed";

                registerMessage.style.color =
                    "red";

            }


        } catch (error) {

            console.error(
                "Register error:",
                error
            );


            registerMessage.textContent =
                "Unable to connect to server.";

            registerMessage.style.color =
                "red";

        }

    }
);