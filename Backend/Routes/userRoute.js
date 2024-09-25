const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = "jfjhjfdfldjfkdhfksjgjsdkg4758yiuht5h89t5yte5jthe5ty54utrt4$%^^%&%^%&^hgfdhufb"; // Use a strong and secure secret key

// Registration route
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

// Middleware for JWT Authentication
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Check if token exists

    if (!token) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Set user info to request
        next();
    });
};

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ status: false, message: "Invalid username" });
        }

        // Validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ status: false, message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        return res.status(200).json({ status: true, token });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = router;
