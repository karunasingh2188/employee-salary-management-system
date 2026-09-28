const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");


// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors()
);

app.use(
    express.json()
);


// ==========================================
// ROUTES
// ==========================================

const authRoutes =
    require("./routes/authRoutes");

const employeeRoutes =
    require("./routes/employeeRoutes");

const salaryRoutes =
    require("./routes/salaryRoutes");


// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);


// Employees
app.use(
    "/api/employees",
    employeeRoutes
);


// Salaries
app.use(
    "/api/salaries",
    salaryRoutes
);


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "Employee Salary Management API is running"

    });

});


// ==========================================
// 404 ROUTE
// ==========================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "Route not found"

        });

    }
);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
    (error, req, res, next) => {

        console.error(
            "Server Error:",
            error
        );


        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message ||
                "Internal server error"

        });

    }
);


// ==========================================
// SERVER PORT
// ==========================================

const PORT =
    process.env.PORT || 5000;


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);