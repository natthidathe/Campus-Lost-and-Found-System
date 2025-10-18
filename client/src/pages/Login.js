import React, { useState } from "react";
import "../css/Login.css"; 
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Logging in with:", email, password);
        //TODO: integrate AWS Cognito authentication here later

        //directly navigate to home page after clicking login
        navigate("/home");
    };

    return (
        <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
            <label>Email</label>
            <input
            type="email"
            placeholder="Enter your university email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            //   required
            />

            <label>Password</label>
            <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            //   required
            />

            <button type="submit" className="login-button">Login</button>
        </form>
        </div>
    );
    }

    export default Login;
