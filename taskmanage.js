import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = sessionStorage.getItem('token'); // Retrieve token from session

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch tasks for authenticated user by including the token in the headers
        const response = await axios.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,  // Include JWT token in Authorization header
          },
        });

        setTasks(response.data);  // Update state with the tasks
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

  return (
    <div>
      <h1>Your Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>{task.task}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;