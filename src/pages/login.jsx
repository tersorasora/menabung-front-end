import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './login.css'
import API from "../api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in:", { username, password });

    try {
        const res = await API.post("/User/login", { username, password });
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login successful");
        navigate("/");
    }catch (error) {
      alert(error.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-background flex flex-col items-center justify-center">
      <div className="login-container">
        <h2 className="text-red-600">LOGIN PAGE</h2>
        <form onSubmit={handleLogin}>
          <div className="form-section-username" style={{ marginBottom: "1rem" }}>
            <h3 className="text-red-100 ">USERNAME</h3>
            <input name="username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="form-section-password" style={{ marginBottom: "1rem" }}>
            <h3 className="text-red-100 ">Password</h3>
            <input name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className="login-btn" type="submit" to="/">Login</button>
        </form>
        <Link className="text-red-400" to="/register">Belum Punya Akun?</Link>
      </div>
    </div>
  );
}
