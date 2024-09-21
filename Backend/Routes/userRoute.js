const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = "gkifjgufhguhidjfoedi$^%&%%*456687546"; // Change this to a secure key

router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if all required fields are provided
        if (!email || !username || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "Email already registered" });
        }

        // Hash the password before saving
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashPassword });
        await newUser.save();

        return res.status(201).json({ status: true, message: "Registered Successfully" });

    } catch (error) {
        console.error("Registration error:", error.message);
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = router;
