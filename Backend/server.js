const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./DBconfig/DB');
const UserRoute = require('./Routes/userRoute');
const TaskRoute = require('./Routes/TaskRoute');

// Load environment variables from .env file (if using dotenv)
dotenv.config();

// Define the Express app
const app = express();

// Use the dependencies in the proper way
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Define CORS configuration
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's domain
    methods: 'GET,POST,PUT,DELETE,PATCH', // Specify the allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Specify the allowed headers
    credentials: true, // Enable cookies if needed
};

// Apply CORS middleware with the configuration
app.use(cors(corsOptions));

// Database connection
connectDB();

// Route import
app.use('/user', UserRoute);
app.use('/tasks', TaskRoute); // Adjusting the route for clarity

// Running the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
