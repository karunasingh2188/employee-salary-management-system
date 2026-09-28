const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
};


// ==========================================
// REGISTER USER
// ==========================================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;


        // Check required fields

        if (
            !name ||
            !email ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password"
            });

        }


        // Check existing user

        const existingUser =
            await User.findOne({
                email
            });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        }


        // Hash password

        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        // Create user

        const user =
            await User.create({

                name,

                email,

                password: hashedPassword,

                role:
                    role === "admin"
                        ? "admin"
                        : "employee"

            });


        res.status(201).json({

            success: true,

            message:
                "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });

    } catch (error) {

        console.error(
            "Register error:",
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
// LOGIN USER
// ==========================================

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Check fields

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please provide email and password"

            });

        }


        // Find user

        const user =
            await User.findOne({
                email
            });


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Compare password

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Generate token

        const token =
            generateToken(user);


        // Login response

        res.status(200).json({

            success: true,

            message:
                "Login successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        console.error(
            "Login error:",
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
// EXPORT
// ==========================================

module.exports = {

    registerUser,
    loginUser

};