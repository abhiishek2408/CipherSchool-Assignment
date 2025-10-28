import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await login({ email, password });
      nav("/dashboard");
    } catch (error) {
      setErr(error?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{padding:24,maxWidth:480, margin:"40px auto"}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:12}}>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div style={{marginBottom:12}}>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {err && <div style={{color:"red"}}>{err}</div>}
        <button type="submit">Login</button>
      </form>
      <div style={{marginTop:12}}>
        No account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
}
