// ==========================================
// API URL
// ==========================================

const API_URL = "http://localhost:5000/api/employees";


// ==========================================
// AUTH TOKEN
// ==========================================

const token = localStorage.getItem("token");


// ==========================================
// CHECK LOGIN
// ==========================================

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// DOM ELEMENTS
// ==========================================

// Employee form
const employeeForm =
    document.getElementById("employeeForm");

const employeeTableBody =
    document.getElementById("employeeTableBody");


// ==========================================
// USER + LOGOUT
// ==========================================

const welcomeUser =
    document.getElementById("welcomeUser");

const logoutBtn =
    document.getElementById("logoutBtn");


// ==========================================
// ANALYTICS
// ==========================================

const totalEmployeesElement =
    document.getElementById("totalEmployees");

const totalSalaryElement =
    document.getElementById("totalSalary");

const averageSalaryElement =
    document.getElementById("averageSalary");


// ==========================================
// SEARCH
// ==========================================

const searchName =
    document.getElementById("searchName");

const searchCity =
    document.getElementById("searchCity");

const searchDepartment =
    document.getElementById("searchDepartment");

const searchBtn =
    document.getElementById("searchBtn");

const resetBtn =
    document.getElementById("resetBtn");


// ==========================================
// PAGINATION
// ==========================================

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const pageInfo =
    document.getElementById("pageInfo");


// ==========================================
// EDIT MODAL
// ==========================================

const editModal =
    document.getElementById("editModal");

const editEmployeeForm =
    document.getElementById("editEmployeeForm");

const editEmployeeId =
    document.getElementById("editEmployeeId");

const editName =
    document.getElementById("editName");

const editEmail =
    document.getElementById("editEmail");

const editCity =
    document.getElementById("editCity");

const editDepartment =
    document.getElementById("editDepartment");

const editSalary =
    document.getElementById("editSalary");

const editExperience =
    document.getElementById("editExperience");

const closeModalBtn =
    document.getElementById("closeModalBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");


// ==========================================
// PAGINATION VARIABLES
// ==========================================

let currentPage = 1;

const limit = 5;

let totalPages = 1;


// ==========================================
// SHOW LOGGED-IN USER
// ==========================================

const user =
    JSON.parse(
        localStorage.getItem("user")
    );


// ==========================================
// ADMIN ACCESS CHECK
// ==========================================

if (!user || user.role !== "admin") {

    alert("Admin access required.");

    window.location.href =
        "login.html";

}


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
// LOAD DATA WHEN PAGE OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEmployees();

        loadAnalytics();

    }
);


// ==========================================
// AUTH HEADERS
// ==========================================

function getAuthHeaders() {

    return {

        "Content-Type": "application/json",

        "Authorization":
            `Bearer ${token}`

    };

}


// ==========================================
// LOAD EMPLOYEES
// ==========================================

async function loadEmployees() {

    try {

        const response =
            await fetch(
                `${API_URL}/pagination?page=${currentPage}&limit=${limit}`,
                {
                    method: "GET",

                    headers: {
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

            logout();

            return;

        }


        // ==========================================
        // API ERROR
        // ==========================================

        if (!data.success) {

            alert(
                data.message ||
                "Failed to load employees"
            );

            return;

        }


        // ==========================================
        // PAGINATION DATA
        // ==========================================

        totalPages =
            data.totalPages || 1;


        // ==========================================
        // DISPLAY EMPLOYEES
        // ==========================================

        displayEmployees(
            data.employees
        );


        // ==========================================
        // UPDATE PAGINATION
        // ==========================================

        updatePagination();


    } catch (error) {

        console.error(
            "Error loading employees:",
            error
        );

        alert(
            "Unable to connect to server. Please make sure backend is running."
        );

    }

}


// ==========================================
// DISPLAY EMPLOYEES
// ==========================================

function displayEmployees(employees) {

    employeeTableBody.innerHTML = "";


    if (
        !employees ||
        employees.length === 0
    ) {

        employeeTableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="text-align:center;"
                >
                    No employees found
                </td>

            </tr>

        `;

        return;

    }


    employees.forEach(
        function (employee) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${employee.name}
                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.city}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>
                    ₹${Number(
                        employee.salary
                    ).toLocaleString("en-IN")}
                </td>

                <td>
                    ${employee.experience} years
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editEmployee('${employee._id}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteEmployee('${employee._id}')"
                    >
                        Delete
                    </button>

                </td>

            `;


            employeeTableBody.appendChild(row);

        }
    );

}


// ==========================================
// ADD EMPLOYEE
// ==========================================

employeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const employeeData = {

            name:
                document
                    .getElementById("name")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            city:
                document
                    .getElementById("city")
                    .value
                    .trim(),

            department:
                document
                    .getElementById("department")
                    .value,

            salary:
                Number(
                    document
                        .getElementById("salary")
                        .value
                ),

            experience:
                Number(
                    document
                        .getElementById("experience")
                        .value
                )

        };


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !employeeData.name ||
            !employeeData.email ||
            !employeeData.city ||
            !employeeData.department
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        if (
            employeeData.salary < 0
        ) {

            alert(
                "Salary cannot be negative."
            );

            return;

        }


        if (
            employeeData.experience < 0
        ) {

            alert(
                "Experience cannot be negative."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    API_URL,
                    {

                        method: "POST",

                        headers:
                            getAuthHeaders(),

                        body:
                            JSON.stringify(
                                employeeData
                            )

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Employee added successfully!"
                );


                employeeForm.reset();


                currentPage = 1;


                loadEmployees();

                loadAnalytics();


            } else {

                alert(
                    data.message ||
                    "Failed to add employee"
                );

            }


        } catch (error) {

            console.error(
                "Error adding employee:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ==========================================
// DELETE EMPLOYEE
// ==========================================

async function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {

                    method: "DELETE",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }

                }
            );


        const data =
            await response.json();


        if (data.success) {

            alert(
                "Employee deleted successfully!"
            );


            loadEmployees();

            loadAnalytics();


        } else {

            alert(
                data.message ||
                "Failed to delete employee"
            );

        }


    } catch (error) {

        console.error(
            "Error deleting employee:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


// ==========================================
// EDIT EMPLOYEE
// ==========================================

async function editEmployee(id) {

    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                "Unable to get employee data"
            );

            return;

        }


        const employee =
            data.employees.find(
                function (emp) {

                    return emp._id === id;

                }
            );


        if (!employee) {

            alert(
                "Employee not found"
            );

            return;

        }


        // ==========================================
        // FILL EDIT FORM
        // ==========================================

        editEmployeeId.value =
            employee._id;

        editName.value =
            employee.name || "";

        editEmail.value =
            employee.email || "";

        editCity.value =
            employee.city || "";

        editDepartment.value =
            employee.department || "";

        editSalary.value =
            employee.salary || "";

        editExperience.value =
            employee.experience || "";


        // ==========================================
        // OPEN MODAL
        // ==========================================

        editModal.style.display =
            "flex";


    } catch (error) {

        console.error(
            "Error opening edit modal:",
            error
        );

        alert(
            "Unable to connect to server."
        );

    }

}


// ==========================================
// CLOSE EDIT MODAL
// ==========================================

function closeEditModal() {

    editModal.style.display =
        "none";

    editEmployeeForm.reset();

}


// ==========================================
// CLOSE MODAL BUTTON
// ==========================================

closeModalBtn.addEventListener(
    "click",
    function () {

        closeEditModal();

    }
);


// ==========================================
// CANCEL EDIT BUTTON
// ==========================================

cancelEditBtn.addEventListener(
    "click",
    function () {

        closeEditModal();

    }
);


// ==========================================
// CLOSE MODAL OUTSIDE CLICK
// ==========================================

editModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target === editModal
        ) {

            closeEditModal();

        }

    }
);


// ==========================================
// UPDATE EMPLOYEE
// ==========================================

editEmployeeForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const id =
            editEmployeeId.value;


        const updatedEmployee = {

            name:
                editName.value.trim(),

            email:
                editEmail.value.trim(),

            city:
                editCity.value.trim(),

            department:
                editDepartment.value,

            salary:
                Number(
                    editSalary.value
                ),

            experience:
                Number(
                    editExperience.value
                )

        };


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !updatedEmployee.name ||
            !updatedEmployee.email ||
            !updatedEmployee.city ||
            !updatedEmployee.department
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        if (
            updatedEmployee.salary < 0
        ) {

            alert(
                "Salary cannot be negative."
            );

            return;

        }


        if (
            updatedEmployee.experience < 0
        ) {

            alert(
                "Experience cannot be negative."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/${id}`,
                    {

                        method: "PUT",

                        headers:
                            getAuthHeaders(),

                        body:
                            JSON.stringify(
                                updatedEmployee
                            )

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                alert(
                    "Employee updated successfully!"
                );


                closeEditModal();


                loadEmployees();

                loadAnalytics();


            } else {

                alert(
                    data.message ||
                    "Failed to update employee"
                );

            }


        } catch (error) {

            console.error(
                "Error updating employee:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ==========================================
// SEARCH EMPLOYEES
// ==========================================

searchBtn.addEventListener(
    "click",
    async function () {

        const name =
            searchName.value.trim();

        const city =
            searchCity.value.trim();

        const department =
            searchDepartment.value;


        if (
            !name &&
            !city &&
            !department
        ) {

            currentPage = 1;

            loadEmployees();

            return;

        }


        try {

            const params =
                new URLSearchParams();


            if (name) {

                params.append(
                    "name",
                    name
                );

            }


            if (city) {

                params.append(
                    "city",
                    city
                );

            }


            if (department) {

                params.append(
                    "department",
                    department
                );

            }


            const response =
                await fetch(
                    `${API_URL}/search?${params.toString()}`,
                    {

                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`
                        }

                    }
                );


            const data =
                await response.json();


            if (data.success) {

                displayEmployees(
                    data.employees
                );


                pageInfo.textContent =
                    `Search Results: ${data.count}`;


                prevBtn.disabled =
                    true;

                nextBtn.disabled =
                    true;


            } else {

                alert(
                    data.message ||
                    "Search failed"
                );

            }


        } catch (error) {

            console.error(
                "Search error:",
                error
            );

            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ==========================================
// RESET SEARCH
// ==========================================

resetBtn.addEventListener(
    "click",
    function () {

        searchName.value = "";

        searchCity.value = "";

        searchDepartment.value = "";

        currentPage = 1;

        loadEmployees();

    }
);


// ==========================================
// UPDATE PAGINATION
// ==========================================

function updatePagination() {

    pageInfo.textContent =
        `Page ${currentPage} of ${totalPages}`;


    prevBtn.disabled =
        currentPage <= 1;


    nextBtn.disabled =
        currentPage >= totalPages;

}


// ==========================================
// PREVIOUS PAGE
// ==========================================

prevBtn.addEventListener(
    "click",
    function () {

        if (
            currentPage > 1
        ) {

            currentPage--;

            loadEmployees();

        }

    }
);


// ==========================================
// NEXT PAGE
// ==========================================

nextBtn.addEventListener(
    "click",
    function () {

        if (
            currentPage < totalPages
        ) {

            currentPage++;

            loadEmployees();

        }

    }
);


// ==========================================
// LOAD ANALYTICS
// ==========================================

async function loadAnalytics() {

    try {

        const response =
            await fetch(
                `${API_URL}/analytics`,
                {

                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }

                }
            );


        const data =
            await response.json();


        if (!data.success) {

            console.error(
                data.message ||
                "Analytics failed"
            );

            return;

        }


        const analytics =
            data.analytics;


        // ==========================================
        // TOTAL EMPLOYEES
        // ==========================================

        totalEmployeesElement.textContent =
            analytics.totalEmployees;


        // ==========================================
        // TOTAL SALARY
        // ==========================================

        totalSalaryElement.textContent =
            `₹${Number(
                analytics.totalSalary
            ).toLocaleString("en-IN")}`;


        // ==========================================
        // AVERAGE SALARY
        // ==========================================

        averageSalaryElement.textContent =
            `₹${Number(
                analytics.averageSalary
            ).toLocaleString(
                "en-IN",
                {
                    maximumFractionDigits: 2
                }
            )}`;


    } catch (error) {

        console.error(
            "Analytics error:",
            error
        );

    }

}


// ==========================================
// LOGOUT FUNCTION
// ==========================================

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";

}