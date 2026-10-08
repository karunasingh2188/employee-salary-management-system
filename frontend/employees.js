// ==========================================
// API URL
// ==========================================

const API_URL = "https://employee-salary-management-system-ghgy.onrender.com/api";

// ==========================================
// GET TOKEN & USER
// ==========================================

const token = localStorage.getItem("token");

const userData = localStorage.getItem("user");

const user = userData
    ? JSON.parse(userData)
    : null;


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token || !user) {

    window.location.href = "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const welcomeUser =
    document.getElementById("welcomeUser");

const logoutBtn =
    document.getElementById("logoutBtn");

const employeeProfile =
    document.getElementById("employeeProfile");

const employeeSalary =
    document.getElementById("employeeSalary");


// ==========================================
// NAVIGATION BUTTONS
// ==========================================

const dashboardBtn =
    document.getElementById("dashboardBtn");

const profileBtn =
    document.getElementById("profileBtn");

const dashboardBtn2 =
    document.getElementById("dashboardBtn2");

const profileBtn2 =
    document.getElementById("profileBtn2");


// ==========================================
// SHOW USER NAME
// ==========================================

if (user && welcomeUser) {

    welcomeUser.textContent =
        `Welcome, ${user.name || user.email}`;

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        function () {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// DASHBOARD BUTTON
// ==========================================

if (dashboardBtn) {

    dashboardBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "employee.html";

        }
    );

}


if (dashboardBtn2) {

    dashboardBtn2.addEventListener(
        "click",
        function () {

            window.location.href =
                "employee.html";

        }
    );

}


// ==========================================
// PROFILE BUTTON
// ==========================================

if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );

}


if (profileBtn2) {

    profileBtn2.addEventListener(
        "click",
        function () {

            window.location.href =
                "profile.html";

        }
    );

}


// ==========================================
// LOAD EMPLOYEE DATA
// ==========================================

async function loadEmployeeData() {

    try {

        employeeProfile.innerHTML =
            "<p>Loading employee information...</p>";


        const response =
            await fetch(
                `${API_URL}/employees/me`,
                {

                    method: "GET",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        // ==========================================
        // AUTH ERROR
        // ==========================================

        if (
            response.status === 401 ||
            response.status === 403
        ) {

            alert(
                "Session expired. Please login again."
            );


            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "login.html";

            return;

        }


        // ==========================================
        // SUCCESS
        // ==========================================

        if (data.success) {

            const employee =
                data.employee;


            employeeProfile.innerHTML = `

                <div class="profile-item">

                    <span>
                        Name
                    </span>

                    <strong>
                        ${employee.name}
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        Email
                    </span>

                    <strong>
                        ${employee.email}
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        City
                    </span>

                    <strong>
                        ${employee.city}
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        Department
                    </span>

                    <strong>
                        ${employee.department}
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        Experience
                    </span>

                    <strong>
                        ${employee.experience} years
                    </strong>

                </div>


                <div class="profile-item">

                    <span>
                        Employee ID
                    </span>

                    <strong>
                        ${employee._id}
                    </strong>

                </div>

            `;


            // ==========================================
            // SALARY
            // ==========================================

            employeeSalary.textContent =
                `₹${Number(
                    employee.salary
                ).toLocaleString("en-IN")}`;


        } else {

            employeeProfile.innerHTML = `

                <p>
                    ${
                        data.message ||
                        "Unable to load employee data."
                    }
                </p>

            `;

        }


    } catch (error) {

        console.error(
            "Employee data error:",
            error
        );


        employeeProfile.innerHTML = `

            <p>
                Unable to connect to server.
            </p>

        `;

    }

}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEmployeeData();

    }
);
