import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Ab yahan backend API call ho raha hai
      const user = await register(form);

      // Register ke baad auto login ho chuka hai (AuthContext me)
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "doctor") navigate("/doctor/dashboard");
      else navigate("/patient/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0f66d1,#0f172a)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(15,23,42,0.4)",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
        }}
      >
        {/* LEFT PANEL – same as login */}
        <div
          style={{
            background: "linear-gradient(180deg,#0f66d1,#0b3c88)",
            color: "white",
            padding: "40px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "18px",
                fontSize: "26px",
                fontWeight: "bold",
              }}
            >
              SF
            </div>

            <h2 style={{ fontSize: "24px", marginBottom: "6px" }}>
              Welcome to
            </h2>
            <h1
              style={{
                fontSize: "30px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              Sun-Fibo
            </h1>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                maxWidth: "320px",
                opacity: 0.9,
              }}
            >
              Create your account to access the Sun-Fibo Technology patient
              profile management system. One login for patients, doctors, and
              admin.
            </p>
          </div>

          <div
            style={{
              fontSize: "11px",
              display: "flex",
              justifyContent: "space-between",
              opacity: 0.8,
              marginTop: "30px",
            }}
          >
            <span>Sun-Fibo Technology</span>
            <span>Healthcare · Patient Portal</span>
          </div>
        </div>

        {/* RIGHT PANEL – register form */}
        <div
          style={{
            padding: "32px 32px 28px",
            background: "#ffffff",
          }}
        >
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "6px",
              color: "#0f172a",
            }}
          >
            Create your account
          </h2>
          <p
            style={{ fontSize: "13px", color: "#6b7280", marginBottom: "16px" }}
          >
            Register as patient, doctor, or admin and get started.
          </p>

          {error && (
            <p
              style={{
                fontSize: "12px",
                color: "#b91c1c",
                marginBottom: "10px",
              }}
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Full name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "9px 11px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              E-mail address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "9px 11px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "9px 11px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{
                fontSize: "13px",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Register as
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "9px 11px",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting
                  ? "#93c5fd"
                  : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                padding: "10px 0",
                border: "none",
                borderRadius: "999px",
                fontWeight: "600",
                cursor: submitting ? "not-allowed" : "pointer",
                marginBottom: "8px",
              }}
            >
              {submitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p
            style={{
              fontSize: "12px",
              color: "#6b7280",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}