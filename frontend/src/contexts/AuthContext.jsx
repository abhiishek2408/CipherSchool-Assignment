import React, { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "../api/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("cipherstudio_user");
    return raw ? JSON.parse(raw) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      localStorage.setItem("cipherstudio_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("cipherstudio_user");
    }
  }, [user]);

  const saveToken = (token) => {
    localStorage.setItem("cipherstudio_token", token);
  };

  const register = async ({ name, email, password }) => {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
    saveToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const login = async ({ email, password }) => {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    saveToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("cipherstudio_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
