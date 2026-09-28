const express = require("express");

const router = express.Router();


// ==========================================
// EMPLOYEE CONTROLLER
// ==========================================

const {

    addEmployee,

    getEmployees,

    getEmployeeById,

    updateEmployee,

    deleteEmployee,

    searchEmployees,

    getEmployeesWithPagination,

    getEmployeeAnalytics,

    getMyProfile

} = require("../controllers/employeeController");


// ==========================================
// JWT MIDDLEWARE
// ==========================================

const {

    protect,

    adminOnly

} = require("../middleware/authMiddleware");


// ==========================================
// EMPLOYEE ROUTES
// ==========================================


// ==========================================
// ADD EMPLOYEE
// Only Admin
// ==========================================

router.post(
    "/",
    protect,
    adminOnly,
    addEmployee
);


// ==========================================
// SEARCH EMPLOYEES
// Logged-in users
// ==========================================

router.get(
    "/search",
    protect,
    searchEmployees
);


// ==========================================
// PAGINATION
// Logged-in users
// ==========================================

router.get(
    "/pagination",
    protect,
    getEmployeesWithPagination
);


// ==========================================
// ANALYTICS
// Logged-in users
// ==========================================

router.get(
    "/analytics",
    protect,
    getEmployeeAnalytics
);


// ==========================================
// GET LOGGED-IN EMPLOYEE PROFILE
// IMPORTANT: MUST BE BEFORE /:id
// ==========================================

router.get(
    "/me",
    protect,
    getMyProfile
);


// ==========================================
// GET SINGLE EMPLOYEE
// Logged-in users
// ==========================================

router.get(
    "/:id",
    protect,
    getEmployeeById
);


// ==========================================
// GET ALL EMPLOYEES
// Logged-in users
// ==========================================

router.get(
    "/",
    protect,
    getEmployees
);


// ==========================================
// UPDATE EMPLOYEE
// Only Admin
// ==========================================

router.put(
    "/:id",
    protect,
    adminOnly,
    updateEmployee
);


// ==========================================
// DELETE EMPLOYEE
// Only Admin
// ==========================================

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteEmployee
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;