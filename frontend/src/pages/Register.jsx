import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr]=useState(null);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      await register({ name, email, password });
      nav("/dashboard");
    } catch (error) {
      setErr(error?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{padding:24, maxWidth:480, margin:"40px auto"}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div style={{marginBottom:12}}>
          <label>Name</label><br/>
          <input value={name} onChange={e=>setName(e.target.value)} required/>
        </div>
        <div style={{marginBottom:12}}>
          <label>Email</label><br/>
          <input value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div style={{marginBottom:12}}>
          <label>Password</label><br/>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        {err && <div style={{color:"red"}}>{err}</div>}
        <button type="submit">Create account</button>
      </form>
      <div style={{marginTop:12}}>
        Already have account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
