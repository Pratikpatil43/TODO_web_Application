const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Tasks = require('../models/Tasks');

// Secret key for JWT
const secretKey = "jfjhjfdfldjfkdhfksjgjsdkg4758yiuht5h89t5yte5jthe5ty54utrt4$%^^%&%^%&^hgfdhufb";

// Register route
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

        // Create and save new user
        const newUser = new User({ username, email, password: hashPassword });
        await newUser.save();

        // Respond with success
        return res.status(201).json({ status: true, message: "Registered Successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if all required fields are provided
        if (!username || !password) {
            return res.status(400).json({ status: false, message: "All fields are required" });
        }

        // Find user by username
        const user = await User.findOne({ username });

        // Validate user credentials
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, secretKey, { expiresIn: '28h' });

        // Respond with token
        return res.status(200).json({ status: true, message: "Login Successful", token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

// Profile route to fetch all tasks for the authenticated user - Authenticated users only
router.get('/profile', async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers?.authorization?.split(' ')[1];

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ status: false, message: "Access Denied. No token provided." });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id; // JWT should contain user's ID in the `id` field

        // Find all tasks associated with the user ID
        const tasks = await Tasks.find({ userId });

        // Check if any tasks are found
        if (tasks.length === 0) {
            return res.status(404).json({ status: false, message: "No tasks found for the user" });
        }

        // Respond with tasks data
        return res.status(200).json({ status: true, message: "Tasks fetched successfully", data: tasks });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Something went wrong", error: error.message });
    }
});

module.exports = router;
