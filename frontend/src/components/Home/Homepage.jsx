import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {

    return (
        <>

            <div className="container">
                <h1 className="display-4">Welcome to Our Platform</h1>
                <p className="lead">
                    Please choose one of the following registration options:
                </p>
                <div>
                    <Link to='customer_register' className="btn btn-primary btn-custom">
                        Customer Register
                    </Link>
                </div>
                <div>

                    <Link to="/admin_register" className="btn btn-success btn-custom">
                        Admin Register
                    </Link>
                </div>
            </div>

        </>
    )
};

export default Homepage;