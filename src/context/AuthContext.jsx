// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// Backend base URL
// Pehle env se lega, nahi mila to Render ka URL use karega
const API_ROOT =
  import.meta.env.VITE_API_ROOT || "https://ppms-server-3.onrender.com";
const API_BASE_URL = `${API_ROOT}/api/auth`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // { id, name, email, role }
  const [token, setToken] = useState(null); // JWT string
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("ppms_user");
    const storedToken = localStorage.getItem("ppms_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem("ppms_user");
        localStorage.removeItem("ppms_token");
      }
    }
    setLoading(false);
  }, []);

  const saveAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("ppms_user", JSON.stringify(userData));
    localStorage.setItem("ppms_token", jwtToken);
  };

  const register = async ({ name, email, password, role }) => {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // register ke baad auto login
    saveAuth(data.user, data.token);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    saveAuth(data.user, data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ppms_user");
    localStorage.removeItem("ppms_token");
  };

  // Authorized fetch – JSON + FormData (file upload) dono handle karega
  const authFetch = async (url, options = {}) => {
    const finalOptions = { ...options };
    const headers = {
      ...(options.headers || {}),
    };

    // JWT token header
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Agar body FormData nahi hai, tab hi JSON content-type set karo
    const isFormData = finalOptions.body instanceof FormData;
    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    finalOptions.headers = headers;

    const res = await fetch(url, finalOptions);
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);