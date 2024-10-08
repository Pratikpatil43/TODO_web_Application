import React, { useState, useEffect } from 'react';
import './Tasks.css';
import toast, { Toaster } from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookies from 'js-cookie';

const Tasks = () => {
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [taskAction, setTaskAction] = useState('Pending');
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dueTime, setDueTime] = useState("");

    // Function to format date and time into 12-hour format with AM/PM
    const formatDateTime = (dateTime) => {
        if (!dateTime) return "";

        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "numeric",
            minute: "numeric",
            hour12: true, // Enable 12-hour format with AM/PM
        };

        return new Date(dateTime).toLocaleString("en-US", options);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        if (showModal) {
            resetForm(); // Reset the form only when closing
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredTasks = tasks.filter(task =>
        task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const fetchUserTasks = async () => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error("You need to log in again.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:3000/tasks/getTasks", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching user tasks:", error);
            toast.error("Failed to fetch tasks or tasks not found.");
        }
    };

    const handleCreateOrUpdateTask = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');

        // Basic validation
        if (!taskName.trim()) {
            toast.error("Task Name is required");
            return;
        }
        if (!description.trim()) {
            toast.error("Description is required");
            return;
        }
        if (!dueTime) {
            toast.error("Due Time is required");
            return;
        }

        const payload = {
            task: taskName,
            time: dueTime,
            description,
            taskAction,
        };

        try {
            if (selectedTaskId) {
                await axios.patch(`http://localhost:3000/tasks/updatetask/${selectedTaskId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Task updated successfully.");
            } else {
                await axios.post("http://localhost:3000/tasks/createTasks", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Task created successfully.");
            }

            // Refresh tasks and close modal
            fetchUserTasks();
            toggleModal();
        } catch (error) {
            console.error("Error creating/updating task:", error);
            toast.error("Failed to create/update task.");
        }
    };

    const handleEditTask = (task) => {
        setTaskName(task.task);
        setDescription(task.description);
        setDueTime(task.time);
        setTaskAction(task.taskAction);
        setSelectedTaskId(task._id);
        toggleModal();
    };

    const handleDeleteTask = async (taskId) => {
        const token = Cookies.get('token');

        if (!token) {
            toast.error("You need to log in again.");
            return;
        }

        try {
            // Optimistically update the UI before the backend call
            const updatedTasks = tasks.filter(task => task._id !== taskId);
            setTasks(updatedTasks);

            await axios.delete(`http://localhost:3000/tasks/deleteTask/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Task deleted successfully.");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task.");
            // Optionally, revert optimistic UI update if delete fails
            fetchUserTasks();
        }
    };

    const resetForm = () => {
        setTaskName('');
        setDescription('');
        setDueTime('');
        setTaskAction('Pending');
        setSelectedTaskId(null);
    };

    useEffect(() => {
        fetchUserTasks();
    }, []);

    return (
        <div className="tasks-container">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="left-panel">
                <h2>Task Manager</h2>
                <div className="task-counts">
                    <p>Pending Tasks: {tasks.filter(task => task.taskAction === 'Pending').length}</p>
                    <p>Completed Tasks: {tasks.filter(task => task.taskAction === 'Completed').length}</p>
                    <p>Not Done Tasks: {tasks.filter(task => task.taskAction === 'Not Done').length}</p>
                </div>
                <div className="filter-sort">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search tasks..."
                        onChange={handleSearch}
                    />
                    <button className="search-btn">Search</button><br /><br />
                    <div>
                        <p><center><b>Task Hub</b></center></p>
                        <input type="text" className='Task-workspace' placeholder='Enter your task workspace name' />
                    </div>
                </div>
            </div>

            <div className="main-content">
                <button className="create-task-btn" onClick={toggleModal}>
                    Create Task
                </button>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                        <div key={task._id} className="task-item">
                            <div className="task-header">
                                <h4>{task.task}</h4>
                                <div className="task-actions">
                                    <button className="update-btn" onClick={() => handleEditTask(task)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>Delete</button>
                                </div>
                            </div>
                            <p className="task-desc">{task.description}</p>
                            <p className="task-due">Due: {task.time}</p>
                            <p className={`task-status ${task.taskAction.toLowerCase()}`}>{task.taskAction}</p>
                        </div>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </div>

            {showModal && (
                <div className="modal" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <CloseIcon className="close-icon" onClick={toggleModal} /><br />
                        <form onSubmit={handleCreateOrUpdateTask}>
                            <div className="input-group">
                                <label>Task Name</label>
                                <input
                                    type="text"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Due Time</label>
                                <input
                                    type="datetime-local"
                                    value={dueTime}
                                    onChange={(e) => setDueTime(e.target.value)}
                                    required />
                                <p>Formatted Due Time (12-Hour Format):</p>
                                {dueTime && <p>{formatDateTime(dueTime)}</p>}
                            </div>
                            <div className="input-group">
                                <label>Task Status</label>
                                <select
                                    value={taskAction}
                                    onChange={(e) => setTaskAction(e.target.value)}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Not Done">Not Done</option>
                                </select>
                            </div>
                            <button type="submit" className="create-task-btn">
                                {selectedTaskId ? 'Update Task' : 'Create Task'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;
