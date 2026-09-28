const express = require("express");
const router = express.Router();

const Salary = require("../models/Salary");
const Employee = require("../models/Employee");


// ==========================================
// ADD SALARY RECORD
// ==========================================

router.post("/", async (req, res) => {

    try {

        const {
            employee,
            month,
            year,
            amount,
            status,
            paymentDate,
            notes
        } = req.body;


        // ==========================================
        // CHECK EMPLOYEE
        // ==========================================

        const employeeExists =
            await Employee.findById(employee);

        if (!employeeExists) {

            return res.status(404).json({

                success: false,

                message: "Employee not found"

            });

        }


        // ==========================================
        // CREATE SALARY
        // ==========================================

        const salary =
            await Salary.create({

                employee,
                month,
                year,
                amount,
                status:
                    status || "Unpaid",

                paymentDate:
                    paymentDate || null,

                notes:
                    notes || ""

            });


        // ==========================================
        // RESPONSE
        // ==========================================

        res.status(201).json({

            success: true,

            message:
                "Salary record added successfully",

            salary

        });


    } catch (error) {

        console.error(
            "Add salary error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while adding salary"

        });

    }

});


// ==========================================
// GET ALL SALARY RECORDS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const salaries =
            await Salary.find()
                .populate(
                    "employee",
                    "name email department"
                )
                .sort({
                    createdAt: -1
                });


        res.json({

            success: true,

            count:
                salaries.length,

            salaries

        });


    } catch (error) {

        console.error(
            "Get salary error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while getting salaries"

        });

    }

});


// ==========================================
// GET SALARY HISTORY OF EMPLOYEE
// ==========================================

router.get(
    "/employee/:employeeId",
    async (req, res) => {

        try {

            const salaries =
                await Salary.find({

                    employee:
                        req.params.employeeId

                })
                .populate(
                    "employee",
                    "name email department"
                )
                .sort({

                    year: -1,

                    createdAt: -1

                });


            res.json({

                success: true,

                count:
                    salaries.length,

                salaries

            });


        } catch (error) {

            console.error(
                "Employee salary history error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Server error while getting salary history"

            });

        }

    }
);


// ==========================================
// UPDATE SALARY
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const {
            month,
            year,
            amount,
            status,
            paymentDate,
            notes
        } = req.body;


        const salary =
            await Salary.findById(
                req.params.id
            );


        if (!salary) {

            return res.status(404).json({

                success: false,

                message:
                    "Salary record not found"

            });

        }


        salary.month =
            month ?? salary.month;

        salary.year =
            year ?? salary.year;

        salary.amount =
            amount ?? salary.amount;

        salary.status =
            status ?? salary.status;

        salary.paymentDate =
            paymentDate ?? salary.paymentDate;

        salary.notes =
            notes ?? salary.notes;


        await salary.save();


        res.json({

            success: true,

            message:
                "Salary updated successfully",

            salary

        });


    } catch (error) {

        console.error(
            "Update salary error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while updating salary"

        });

    }

});


// ==========================================
// DELETE SALARY
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const salary =
            await Salary.findByIdAndDelete(
                req.params.id
            );


        if (!salary) {

            return res.status(404).json({

                success: false,

                message:
                    "Salary record not found"

            });

        }


        res.json({

            success: true,

            message:
                "Salary record deleted successfully"

        });


    } catch (error) {

        console.error(
            "Delete salary error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Server error while deleting salary"

        });

    }

});


module.exports = router;