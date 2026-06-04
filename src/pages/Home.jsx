// src/pages/Home.jsx (ya jahan bhi tumhara Home component hai)
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        // IMPORTANT: /public hata diya, direct root se path
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "brightness(0.9)",
      }}
    >
      {/* Top bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "14px",
              background: "rgba(15,23,42,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "20px",
            }}
          >
            SF
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "18px" }}>Sun-fibo</div>
            <div style={{ fontSize: "11px", opacity: 0.8 }}>Technology</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to="/login"
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.7)",
              color: "white",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: "8px 16px",
              borderRadius: "999px",
              background: "white",
              color: "#0f66d1",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Register
          </Link>
        </div>
      </header>

      {/* Hero section */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "40px 60px",
          gap: "40px",
        }}
      >
        {/* Left text */}
        <div style={{ maxWidth: "460px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            Sun-Fibo Technology
          </h1>
          <p
            style={{
              fontSize: "14px",
              lineHeight: "1.7",
              opacity: 0.9,
              marginBottom: "18px",
            }}
          >
            A secure digital platform to manage patient records, prescriptions,
            and diagnostic reports. Designed for hospitals, clinics and
            diagnostic centers with separate portals for Patients, Doctors and
            Admin.
          </p>

          <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
            <Link
              to="/register"
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                background: "white",
                color: "#0f66d1",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Get started
            </Link>
            <Link
              to="/login"
              style={{
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.7)",
                color: "white",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              I already have an account
            </Link>
          </div>

          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            Role-based access • Secure records • Real-time updates
          </p>
        </div>

        {/* Right illustration card */}
        <div
          style={{
            flex: 1,
            maxWidth: "480px",
            background: "rgba(15,23,42,0.6)",
            borderRadius: "26px",
            padding: "20px",
            boxShadow: "0 18px 45px rgba(15,23,42,0.7)",
          }}
        >
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              background: "white",
            }}
          >
            {/* Hospital/doctor image */}
            <div
              style={{
                height: "200px",
                // IMPORTANT: yahan bhi /public nahi, direct root path
                backgroundImage: 'url("/doctor.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>

            <div style={{ padding: "14px 16px" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "4px",
                }}
              >
                Connected Care Dashboard
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                Patients can view their health summary, lab reports and
                prescriptions. Doctors can track medical history and plans.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  fontSize: "11px",
                  color: "#6b7280",
                }}
              >
                <div>Patient Portal</div>
                <div>Doctor Portal</div>
                <div>Admin Panel</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}