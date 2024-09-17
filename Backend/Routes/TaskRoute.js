const express = require('express');
const router = express.Router();
const Task = require('../models/Tasks'); // Ensure your model is correctly imported
const Tasks = require('../models/Tasks');

// API endpoint starts

// Creating task
router.post('/createTasks', async (req, res) => {
    try {
        const { task, time, description, taskAction } = req.body;
        // Validate request body
        if (!task || !time || !description || !taskAction) {
            return res.status(401).json({ message: 'All fields are required' });
        }

        // Create a new task
        const newTask = new Task({
            task: String(task),
            time: String(time),
            description: String(description),
            taskAction: String(taskAction),
        });

        // Save the task
        await newTask.save();
        res.status(201).json({ message: 'Task created!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
});


//Acessing the all the tasks

router.get('/findtask',async(req,res)=>{
    try {
        const tasks = await Tasks.findOne()
        if(!tasks)
        {
        res.status(500).json({ message: 'Tasks not found' });

        }else{
            res.status(201).json(tasks);
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });

        
    }
})
module.exports = router;
