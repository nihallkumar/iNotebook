import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

function Signup(props) {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });

    let history = useHistory()

    const handleSubmit = async (e) => {
        const { name, email, password } = credentials
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const json = await response.json();
        console.log(json);

        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            history.push("/");
            props.showAlert("Account Create Successfully", "success")
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }


    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }


    return (
        <div className="container col-md-8 my-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onchange} name="name" id="name" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onchange} name="email" id="email" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onchange} name="password" id="password" minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onchange} name="cpassword" id="cpassword" minLength={5} required />
                </div>
                <div className="login-form-btn mt-3 ">
                    <button type="submit" className="btn btn-primary">Signup</button>
                </div>
            </form>
        </div>
    )
}

export default Signup
