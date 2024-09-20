import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register/Register';
import Home from './components/Home/Home';

const App = () => {
  return (
    <>
    <Router>
      <Routes>
      <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Register />} />
      </Routes>
    </Router>
    
    
    </>
  )
}

export default App