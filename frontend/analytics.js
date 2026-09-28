
// ==========================================
// API URL
// ==========================================

const API_URL =
    "http://localhost:5000/api/employees";


// ==========================================
// AUTH TOKEN
// ==========================================

const token =
    localStorage.getItem("token");


// ==========================================
// USER
// ==========================================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


// ==========================================
// ADMIN ACCESS CHECK
// ==========================================

if (
    !token ||
    !user ||
    user.role !== "admin"
) {

    alert("Admin access required.");

    window.location.href =
        "login.html";

}


// ==========================================
// DOM ELEMENTS
// ==========================================

const welcomeUser =
    document.getElementById(
        "welcomeUser"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );

const totalEmployees =
    document.getElementById(
        "totalEmployees"
    );

const totalSalary =
    document.getElementById(
        "totalSalary"
    );

const averageSalary =
    document.getElementById(
        "averageSalary"
    );

const highestSalary =
    document.getElementById(
        "highestSalary"
    );

const lowestSalary =
    document.getElementById(
        "lowestSalary"
    );

const totalExperience =
    document.getElementById(
        "totalExperience"
    );

const averageExperience =
    document.getElementById(
        "averageExperience"
    );

const departmentTableBody =
    document.getElementById(
        "departmentTableBody"
    );


// ==========================================
// SHOW USER
// ==========================================

if (
    user &&
    welcomeUser
) {

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

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";

        }
    );

}


// ==========================================
// AUTH HEADERS
// ==========================================

function getAuthHeaders() {

    return {

        "Authorization":
            `Bearer ${token}`

    };

}


// ==========================================
// LOAD ANALYTICS
// ==========================================

async function loadAnalytics() {

    try {

        // ==========================================
        // GET ANALYTICS
        // ==========================================

        const analyticsResponse =
            await fetch(
                `${API_URL}/analytics`,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        const analyticsData =
            await analyticsResponse.json();


        // ==========================================
        // AUTH ERROR
        // ==========================================

        if (
            analyticsResponse.status === 401 ||
            analyticsResponse.status === 403
        ) {

            alert(
                "Session expired. Please login again."
            );

            logoutUser();

            return;

        }


        if (
            !analyticsData.success
        ) {

            alert(
                analyticsData.message ||
                "Unable to load analytics"
            );

            return;

        }


        // ==========================================
        // DISPLAY BASIC ANALYTICS
        // ==========================================

        const analytics =
            analyticsData.analytics;


        totalEmployees.textContent =
            analytics.totalEmployees;


        totalSalary.textContent =
            `₹${Number(
                analytics.totalSalary
            ).toLocaleString("en-IN")}`;


        averageSalary.textContent =
            `₹${Number(
                analytics.averageSalary
            ).toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            )}`;


        // ==========================================
        // GET ALL EMPLOYEES
        // ==========================================

        const employeeResponse =
            await fetch(
                API_URL,
                {
                    method: "GET",

                    headers:
                        getAuthHeaders()
                }
            );


        const employeeData =
            await employeeResponse.json();


        if (
            !employeeData.success
        ) {

            alert(
                employeeData.message ||
                "Unable to load employees"
            );

            return;

        }


        const employees =
            employeeData.employees || [];


        // ==========================================
        // NO EMPLOYEES
        // ==========================================

        if (
            employees.length === 0
        ) {

            highestSalary.textContent =
                "₹0";

            lowestSalary.textContent =
                "₹0";

            totalExperience.textContent =
                "0 years";

            averageExperience.textContent =
                "0 years";

            departmentTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        style="text-align:center;"
                    >
                        No employee data available
                    </td>

                </tr>

            `;

            return;

        }


        // ==========================================
        // SALARY CALCULATIONS
        // ==========================================

        const salaries =
            employees.map(
                employee =>
                    Number(employee.salary) || 0
            );


        const experiences =
            employees.map(
                employee =>
                    Number(employee.experience) || 0
            );


        const highest =
            Math.max(...salaries);


        const lowest =
            Math.min(...salaries);


        const totalExp =
            experiences.reduce(
                (sum, value) =>
                    sum + value,
                0
            );


        const avgExp =
            totalExp /
            experiences.length;


        // ==========================================
        // DISPLAY SALARY INFORMATION
        // ==========================================

        highestSalary.textContent =
            `₹${highest.toLocaleString("en-IN")}`;


        lowestSalary.textContent =
            `₹${lowest.toLocaleString("en-IN")}`;


        totalExperience.textContent =
            `${totalExp.toFixed(1)} years`;


        averageExperience.textContent =
            `${avgExp.toFixed(1)} years`;


        // ==========================================
        // DEPARTMENT ANALYTICS
        // ==========================================

        const departments = {};


        employees.forEach(
            function (employee) {

                const department =
                    employee.department ||
                    "Other";


                if (
                    !departments[department]
                ) {

                    departments[department] = {

                        employees: 0,

                        totalSalary: 0

                    };

                }


                departments[
                    department
                ].employees++;


                departments[
                    department
                ].totalSalary +=
                    Number(
                        employee.salary
                    ) || 0;

            }
        );


        // ==========================================
        // DISPLAY DEPARTMENT TABLE
        // ==========================================

        departmentTableBody.innerHTML =
            "";


        Object.keys(departments).forEach(
            function (department) {

                const data =
                    departments[department];


                const avgSalary =
                    data.totalSalary /
                    data.employees;


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML = `

                    <td>
                        ${department}
                    </td>

                    <td>
                        ${data.employees}
                    </td>

                    <td>
                        ₹${data.totalSalary.toLocaleString("en-IN")}
                    </td>

                    <td>
                        ₹${avgSalary.toLocaleString(
                            "en-IN",
                            {
                                maximumFractionDigits: 2
                            }
                        )}
                    </td>

                `;


                departmentTableBody.appendChild(
                    row
                );

            }
        );


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


// ==========================================
// LOGOUT FUNCTION
// ==========================================

function logoutUser() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "login.html";

}


// ==========================================
// LOAD PAGE DATA
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAnalytics();

    }
);

// ==========================================
// BACK TO DASHBOARD
// ==========================================

const dashboardBtn =
    document.getElementById("dashboardBtn");


if (dashboardBtn) {

    dashboardBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "index.html";

        }
    );

}

