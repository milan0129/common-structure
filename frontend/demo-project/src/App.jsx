import { useState } from 'react'
import { BrowserRouter  } from 'react-router-dom'; 
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Import Routes
import './App.css'
import SignUp from './pages/SignUp';
import Home from './pages/Home';

function App() {


  return (
    <>
  <BrowserRouter basename='/'>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/sign_up' element={<SignUp/>}/>
  </Routes>
  </BrowserRouter>
    </>
  )
}

export default App
