import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './register.css'
import API from "../api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Registering:", { username, nickname, password });

        try {
            const res = await API.post("/User/register", { username, nickname, password });
            alert(res.data.message || "Registration successful");
            navigate("/login");
        }catch (error) {
            alert(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="register-background flex flex-col items-center justify-center">
            <div className="register-container">
                <h2 className="text-red-600">REGISTER PAGE</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-section-username" style={{ marginBottom: "1rem" }}>
                        <h3 className="text-red-100 ">USERNAME</h3>
                        <input name="username" label="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="form-section-nickname" style={{ marginBottom: "1rem" }}>
                        <h3 className="text-red-100 ">NICKNAME</h3>
                        <input name="nickname" label="Nickname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                    </div>
                    <div className="form-section-password" style={{ marginBottom: "1rem" }}>
                        <h3 className="text-red-100 ">PASSWORD</h3>
                        <input name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <button className="register-btn" type="submit">Register</button>
                </form>
                <Link className="text-red-400" to="/login">Sudah Punya Akun?</Link>
            </div>
        </div>

    );
}
