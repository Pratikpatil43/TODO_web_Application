import React, { useState, useEffect } from 'react';
import './Tasks.css';
import toast from 'react-hot-toast';
import CloseIcon from '@mui/icons-material/Close';

const Tasks = () => {
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [taskAction, setTaskAction] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchAnimation, setSearchAnimation] = useState(false);
  const [dueHours, setDueHours] = useState(2); // Default to 2 hours

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to calculate the due date dynamically
  const calculateDueDate = (hours) => {
    const currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + hours);
    return currentDate.toISOString().split('T')[0]; // Return only the date part
  };

  const handleCreateTask = (e) => {
    e.preventDefault(); // Prevent default behavior if triggered by a form

    // Basic validation for empty fields
    if (!taskName.trim()) {
      toast.error("Task Name is required");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!dueTime) {
      toast.error("Due Date is required");
      return;
    }

    // If all validations pass, create the task
    const newTask = { taskName, description, dueTime, taskAction };

    // Ensure task is not accidentally created twice
    setTasks((prevTasks) => [...prevTasks, newTask]);

    // Reset the input fields
    setTaskName('');
    setDescription('');
    setDueTime('');
    setTaskAction('Pending');

    toggleModal(); // Close the modal after creating the task
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const resetForm = () => {
    setTaskName('');
    setDescription('');
    setDueTime('');
    setTaskAction('Pending');
  };

  const handleSearch = () => {
    setShowSearchResults(true);
    setSearchAnimation(true);
    setTimeout(() => {
      setSearchAnimation(false);
    }, 500); // Duration of the animation
  };

  // Filter tasks based on the search term
  const filteredTasks = tasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMinDate = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 24) { // Before midnight
      return now.toISOString().split('T')[0]; // Allow today's date
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1); // Set to tomorrow
      return tomorrow.toISOString().split('T')[0]; // Restrict to tomorrow
    }
  };

  useEffect(() => {
    if (searchTerm === '') {
      setShowSearchResults(false);
    }
  }, [searchTerm]);

  return (
    <div className="tasks-container">
      <div className="left-panel">
        <h2>Task Overview</h2>
        <div className="task-counts">
          <p>Total Tasks: {tasks.length}</p>
          <p>Completed: {tasks.filter((task) => task.taskAction === 'Completed').length}</p>
          <p>Pending: {tasks.filter((task) => task.taskAction === 'Pending').length}</p>
          <p>Not Done: {tasks.filter((task) => task.taskAction === 'Not Done').length}</p>
        </div>
        <div className="filter-sort">
          <input
            type="text"
            placeholder="Search Tasks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`search-input ${searchAnimation ? 'animate' : ''}`}
          />
          <button onClick={handleSearch} className="search-btn">Search</button>
        </div>
      </div>

      <div className="main-content">
        <center><button className="create-task-btn" onClick={toggleModal}>
          Create Task
        </button></center>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <CloseIcon className="close-icon" onClick={toggleModal} />
              <h2>Create New Task</h2>
              <div className="input-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  aria-required
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
                <input
                  type="date"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  min={getMinDate()} // Disable today and past dates
                  required
                />
              </div>

              <div className="input-group">
                <label>Complete in (hours)</label>
                <select value={dueHours} onChange={(e) => setDueHours(Number(e.target.value))}>
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={3}>3 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={24}>1 day</option>
                  <option value={48}>2 days</option>
                  <option value={192}>8 days</option>
                </select>
              </div>

              <div className="input-group">
                <label>Task Action</label>
                <select
                  value={taskAction}
                  onChange={(e) => setTaskAction(e.target.value)}
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Done">Not Done</option>
                </select>
              </div>
              <button className="create-task-btn" onClick={handleCreateTask}>
                Create Task
              </button>
            </div>
          </div>
        )}

        <div className="task-list">
          {showSearchResults ? (
            filteredTasks.length > 0 ? (
              filteredTasks.map((task, index) => (
                <div className="task-item" key={index}>
                  <h3>{task.taskName}</h3>
                  <p>{task.description}</p>
                  <p>Due Time: {task.dueTime}</p>
                  <p>Status: {task.taskAction}</p>
                  <button className="delete-btn" onClick={() => handleDeleteTask(index)}>
                    Delete
                  </button>
                  <button className="update-btn">Update</button>
                </div>
              ))
            ) : (
              <p>No tasks found.</p>
            )
          ) : (
            tasks.map((task, index) => (
              <div className="task-item" key={index}>
                <h3>{task.taskName}</h3>
                <p>{task.description}</p>
                <p>Due Time: {task.dueTime}</p>
                <p>Status: {task.taskAction}</p>
                <button className="delete-btn" onClick={() => handleDeleteTask(index)}>
                  Delete
                </button>
                <button className="update-btn">Update</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
