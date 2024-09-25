const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks'); // Import Task model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || "jfjhjfdfldjfkdhfksjgjsdkg4758yiuht5h89t5yte5jthe5ty54utrt4$%^^%&%^%&^hgfdhufb";

// Creating a task
router.post('/createTasks', async (req, res) => {
    try {
        const { task, time, description, taskAction } = req.body;

        // Check if all required fields are provided
        if (!task || !time || !description || !taskAction) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Extract token from Authorization header
        const token = req.headers?.authorization?.split(' ')[1];

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // Verify token and extract user ID
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token", error: err.message });
        }

        const userId = decoded.id;

        // Validate that the userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        // Create a new task
        const newTask = new Task({
            task: String(task),
            time: String(time),
            description: String(description),
            taskAction: String(taskAction),
            userId: userId // Correctly use userId
        });

        // Save the task
        await newTask.save();
        res.status(201).json({ message: 'Task created successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Get tasks of the authenticated user
router.get('/tasks', async (req, res) => {
    try {
        // Extract token from Authorization header
        const token = req.headers?.authorization?.split(' ')[1];

        // Check if token is provided
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // Verify token and extract user ID
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired token", error: err.message });
        }

        const userId = decoded.id;

        // Fetch tasks for the authenticated user
        const tasks = await Task.find({ userId: userId });

        // Check if any tasks are found
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this user' });
        }

        // Return the user's tasks
        return res.status(200).json(tasks);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Updating a task (authenticated user)
router.patch('/updatetask/:id', async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;

        const taskId = req.params.id;
        const updateData = req.body;

        // Find the task by ID and update it only if it belongs to the authenticated user
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId: userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        res.json({ message: 'Task updated successfully!', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Deleting a task (authenticated user)
router.delete('/deletetask/:id', async (req, res) => {
    try {
        const token = req.headers?.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id;

        const taskId = req.params.id;

        // Find and delete the task only if it belongs to the authenticated user
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId: userId });

        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

module.exports = router;
