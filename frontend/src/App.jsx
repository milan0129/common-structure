import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  
import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Homepage from './components/Home/Homepage';
import CustomerRegister from './components/Customer/register';
import AdminRegister from './components/Admin/register';
import AdminLogin from './components/Admin/login';
import CustomerLogin from './components/Customer/login';
function App() {

  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/customer_register" element={<CustomerRegister />} />
        <Route path="/admin_register" element={<AdminRegister />} />
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/customer_login" element={<CustomerLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
