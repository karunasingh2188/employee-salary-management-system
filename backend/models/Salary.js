const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },

        month: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ["Paid", "Unpaid"],
            default: "Unpaid"
        },

        paymentDate: {
            type: Date,
            default: null
        },

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Salary", salarySchema);