import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AdminRegistrationPage = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'admin'
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3333/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'tIqXqtPtIhuv0FBGaRcRKQ=='
                }
            });

            const data = await response.json();

            if (data.code == 1) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Something went wrong!');
        }
    };

    return (
        <div className="container" >
            <h2 className="text-center">Admin Registration Page</h2>
            <form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Last Name */}
                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email */}
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>


                {/* Submit Button */}
                <button type="submit" className="btn btn-primary btn-block mt-4">Register</button>

                <div className="text-center mt-3">
                    <p>Already have an account? <Link to="/admin_login">Login</Link></p>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
};

export default AdminRegistrationPage;
