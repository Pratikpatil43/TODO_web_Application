import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Navbar from './components/Navbar/Navbar';
import toast, { Toaster } from 'react-hot-toast';
import Tasks from './components/Tasks/Tasks';


const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/tasks' element={<Tasks />} />
      </Routes>
    </Router>
    
    
    </>
  )
}

export default App