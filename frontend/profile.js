// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:5000/api/employees";


// ==========================================
// GET TOKEN
// ==========================================

const token = localStorage.getItem("token");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {

    window.location.href = "login.html";

}


// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {

    try {

        const response = await fetch(
            `${API_URL}/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );


        // ==========================================
        // GET RESPONSE DATA
        // ==========================================

        const data = await response.json();

        console.log("Profile API Response:", data);


        // ==========================================
        // UNAUTHORIZED
        // ==========================================

        if (response.status === 401) {

            localStorage.removeItem("token");

            alert("Session expired. Please login again.");

            window.location.href = "login.html";

            return;
        }


        // ==========================================
        // OTHER ERROR
        // ==========================================

        if (!response.ok) {

            throw new Error(
                data.message || "Failed to load profile"
            );

        }


        // ==========================================
        // GET EMPLOYEE
        // ==========================================

        const employee = data.employee;


        if (!employee) {

            throw new Error(
                "Employee data not found"
            );

        }


        console.log(
            "Logged-in Employee:",
            employee
        );


        // ==========================================
        // NAME
        // ==========================================

        document.getElementById(
            "employeeName"
        ).textContent =
            employee.name || "N/A";


        document.getElementById(
            "name"
        ).textContent =
            employee.name || "N/A";


        // ==========================================
        // DEPARTMENT
        // ==========================================

        document.getElementById(
            "employeeDepartment"
        ).textContent =
            employee.department || "Employee";


        document.getElementById(
            "department"
        ).textContent =
            employee.department || "N/A";


        // ==========================================
        // EMAIL
        // ==========================================

        document.getElementById(
            "email"
        ).textContent =
            employee.email || "N/A";


        // ==========================================
        // CITY
        // ==========================================

        document.getElementById(
            "city"
        ).textContent =
            employee.city || "N/A";


        // ==========================================
        // EXPERIENCE
        // ==========================================

        if (
            employee.experience !== undefined &&
            employee.experience !== null
        ) {

            document.getElementById(
                "experience"
            ).textContent =
                `${employee.experience} Years`;

        } else {

            document.getElementById(
                "experience"
            ).textContent =
                "N/A";

        }


        // ==========================================
        // SALARY
        // ==========================================

        if (
            employee.salary !== undefined &&
            employee.salary !== null
        ) {

            document.getElementById(
                "salary"
            ).textContent =
                `₹${Number(employee.salary).toLocaleString("en-IN")}`;

        } else {

            document.getElementById(
                "salary"
            ).textContent =
                "N/A";

        }


        // ==========================================
        // EMPLOYEE ID
        // ==========================================

        document.getElementById(
            "employeeId"
        ).textContent =
            employee._id || employee.id || "N/A";


        // ==========================================
        // JOINING DATE
        // ==========================================

        if (employee.createdAt) {

            const joiningDate =
                new Date(employee.createdAt);

            document.getElementById(
                "createdAt"
            ).textContent =
                joiningDate.toLocaleDateString("en-IN");

        } else {

            document.getElementById(
                "createdAt"
            ).textContent =
                "N/A";

        }


        // ==========================================
        // AVATAR
        // ==========================================

        if (employee.name) {

            document.getElementById(
                "profileAvatar"
            ).textContent =
                employee.name
                    .charAt(0)
                    .toUpperCase();

        }


    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        alert(
            `Failed to load profile: ${error.message}`
        );

    }

}


// ==========================================
// LOGOUT
// ==========================================

document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

        }
    );


// ==========================================
// LOAD PROFILE
// ==========================================

loadProfile();