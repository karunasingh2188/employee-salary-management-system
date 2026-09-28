const Employee = require("../models/Employee");


// ==========================================
// 1. ADD EMPLOYEE
// ==========================================

const addEmployee = async (req, res) => {

    try {

        const employee =
            await Employee.create(req.body);

        res.status(201).json({
            success: true,
            message: "Employee added successfully",
            employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 2. GET ALL EMPLOYEES
// ==========================================

const getEmployees = async (req, res) => {

    try {

        // Newest employees first
        const employees =
            await Employee.find()
                .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            employees
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 3. GET SINGLE EMPLOYEE BY ID
// ==========================================

const getEmployeeById = async (req, res) => {

    try {

        const employee =
            await Employee.findById(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        res.status(200).json({
            success: true,
            employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 4. UPDATE EMPLOYEE
// ==========================================

const updateEmployee = async (req, res) => {

    try {

        const employee =
            await Employee.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    returnDocument: "after",
                    runValidators: true
                }
            );


        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Employee updated successfully",
            employee
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 5. DELETE EMPLOYEE
// ==========================================

const deleteEmployee = async (req, res) => {

    try {

        const employee =
            await Employee.findByIdAndDelete(
                req.params.id
            );


        if (!employee) {

            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });

        }


        res.status(200).json({
            success: true,
            message: "Employee deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 6. SEARCH & FILTER EMPLOYEES
// ==========================================

const searchEmployees = async (req, res) => {

    try {

        const {
            name,
            department,
            city
        } = req.query;


        const filter = {};


        // Search by name

        if (name) {

            filter.name = {
                $regex: name,
                $options: "i"
            };

        }


        // Filter by department

        if (department) {

            filter.department = {
                $regex: department,
                $options: "i"
            };

        }


        // Filter by city

        if (city) {

            filter.city = {
                $regex: city,
                $options: "i"
            };

        }


        const employees =
            await Employee.find(filter)
                .sort({ createdAt: -1 });


        res.status(200).json({
            success: true,
            count: employees.length,
            employees
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 7. PAGINATION
// ==========================================

const getEmployeesWithPagination = async (req, res) => {

    try {

        const page =
            parseInt(req.query.page) || 1;

        const limit =
            parseInt(req.query.limit) || 10;

        const skip =
            (page - 1) * limit;


        const employees =
            await Employee.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);


        const totalEmployees =
            await Employee.countDocuments();


        const totalPages =
            Math.ceil(
                totalEmployees / limit
            );


        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages,

            totalEmployees,

            employees

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 8. EMPLOYEE ANALYTICS
// ==========================================

const getEmployeeAnalytics = async (req, res) => {

    try {

        // Total employees
        const totalEmployees =
            await Employee.countDocuments();


        // Active employees
        const activeEmployees =
            await Employee.countDocuments({
                status: "Active"
            });


        // Departments
        const departments =
            await Employee.distinct(
                "department"
            );


        // Salary calculations
        const salaryData =
            await Employee.aggregate([

                {
                    $group: {

                        _id: null,

                        totalSalary: {
                            $sum: "$salary"
                        },

                        averageSalary: {
                            $avg: "$salary"
                        }

                    }

                }

            ]);


        const totalSalary =
            salaryData.length > 0
                ? salaryData[0].totalSalary
                : 0;


        const averageSalary =
            salaryData.length > 0
                ? Number(
                    salaryData[0]
                        .averageSalary
                        .toFixed(2)
                )
                : 0;


        res.status(200).json({

            success: true,

            analytics: {

                totalEmployees,

                activeEmployees,

                totalDepartments:
                    departments.length,

                totalSalary,

                averageSalary

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ==========================================
// 9. GET LOGGED-IN EMPLOYEE PROFILE
// ==========================================

const getMyProfile = async (req, res) => {

    try {

        // Email comes from JWT token
        const email = req.user.email;


        // Find logged-in employee
        const employee =
            await Employee.findOne({
                email: email
            });


        if (!employee) {

            return res.status(404).json({

                success: false,

                message:
                    "Employee profile not found."

            });

        }


        res.status(200).json({

            success: true,

            employee

        });

    } catch (error) {

        console.error(
            "Get my profile error:",
            error
        );


        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// ==========================================
// EXPORTS
// ==========================================

module.exports = {

    addEmployee,

    getEmployees,

    getEmployeeById,

    updateEmployee,

    deleteEmployee,

    searchEmployees,

    getEmployeesWithPagination,

    getEmployeeAnalytics,

    getMyProfile

};