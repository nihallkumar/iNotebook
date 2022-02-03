import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';

function Login(props) {
    const [credentials, setCredentials] = useState({ email: "", password: "" });

    let history = useHistory()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5000/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });

        const json = await response.json();
        console.log(json);

        if (json.success) {
            localStorage.setItem("token", json.authtoken);
            props.showAlert("Logged in Successfully", "success")
            history.push("/");
        }
        else {
            props.showAlert("Invalid Credentials", "danger")
        }
    }


    const onchange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (<>
        <div className="container col-md-8 my-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onchange} value={credentials.email} name='email' id="email" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onchange} value={credentials.password} name='password' id="password" />
                </div>
                <button type="submit" className="btn btn-primary">login</button>
            </form>
        </div>
    </>
    )
}

export default Login
