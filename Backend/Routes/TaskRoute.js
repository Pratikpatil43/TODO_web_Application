const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks'); // Import Task model
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = "jfjhjfdfldjfkdhfksjgjsdkg4758yiuht5h89t5yte5jthe5ty54utrt4$%^^%&%^%&^hgfdhufb";

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
        const decoded = jwt.verify(token, secretKey);
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

// Accessing all tasks
router.get('/findtask', async (req, res) => {
    try {
        // Fetch all tasks
        const tasks = await Task.find(); // Use Task model here

        // Check if any tasks are found
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found' });
        }

        // Return all tasks
        return res.status(200).json(tasks);

    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

// Updating a task
router.patch('/updatetask/:id', async (req, res) => {
    try {
        // Extract task ID from the route parameters
        const taskId = req.params.id;

        // Extract update data from the request body
        const updateData = req.body;

        // Find the task by ID and update it with the provided data
        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true, runValidators: true });

        // Check if the task was found and updated
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Respond with the updated task
        res.json({ message: 'Task updated successfully!', task: updatedTask });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
});

// Deleting a task
router.delete('/deletetask/:id', async (req, res) => {
    try {
        // Extract task ID from the route parameters
        const taskId = req.params.id;

        // Find and delete the task by ID
        const deletedTask = await Task.findByIdAndDelete(taskId);

        // Check if the task was found and deleted
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found to delete' });
        }

        // Respond with success message
        return res.status(200).json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});

module.exports = router;
