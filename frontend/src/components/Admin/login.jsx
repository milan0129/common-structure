import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const AdminLoginPage = () => {
    const [formData, setFormData] = useState({
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
            const response = await fetch('http://localhost:3333/api/v1/auth/login', {
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
            <h2 className="text-center">Admin Login Page</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary btn-block mt-4">Login</button>


            </form>
            <ToastContainer />
        </div>
    );
};

export default AdminLoginPage;
