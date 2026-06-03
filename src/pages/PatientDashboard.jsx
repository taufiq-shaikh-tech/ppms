// src/pages/PatientDashboard.jsx
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const { user } = useAuth();

  const patientInfo = {
    name: user?.name || "John Doe",
    id: "PT-2026-001",
    age: 28,
    gender: "Male",
    bloodGroup: "B+",
    lastVisit: "15 May 2026",
    primaryDoctor: "Dr. Neha Sharma",
  };

  const nextAppointments = [
    {
      id: 1,
      date: "30 May 2026",
      time: "10:30 AM",
      doctor: "Dr. Neha Sharma",
      type: "Follow up",
    },
    {
      id: 2,
      date: "12 Jun 2026",
      time: "04:00 PM",
      doctor: "Dr. Arjun Mehta",
      type: "X-Ray review",
    },
  ];

  const reports = [
    {
      id: 1,
      name: "CBC Report",
      date: "10 May 2026",
      doctor: "Dr. Neha Sharma",
      status: "Normal",
    },
    {
      id: 2,
      name: "X-Ray Chest",
      date: "02 May 2026",
      doctor: "Dr. Arjun Mehta",
      status: "Clear",
    },
    {
      id: 3,
      name: "Blood Sugar (Fasting)",
      date: "20 Apr 2026",
      doctor: "Dr. Neha Sharma",
      status: "Slightly High",
    },
  ];

  return (
    <div style={{ padding: "8px 4px" }}>
      {/* HERO – clean gradient, no heavy dark box */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f66d1,#1d4ed8)",
          borderRadius: "24px",
          padding: "20px 22px",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
          marginBottom: "18px",
        }}
      >
        {/* left: avatar + welcome */}
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            {patientInfo.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: "13px", opacity: 0.9 }}>Welcome back,</div>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: "700",
                margin: "0 0 4px",
              }}
            >
              {patientInfo.name}
            </h1>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              Patient ID: {patientInfo.id} • Blood Group: {patientInfo.bloodGroup}
            </div>
            <div style={{ fontSize: "12px", opacity: 0.9, marginTop: "4px" }}>
              Primary Doctor: {patientInfo.primaryDoctor}
            </div>
          </div>
        </div>

        {/* right: small soft “health summary” badge */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "18px",
            background: "rgba(15,23,42,0.25)",
            fontSize: "12px",
            minWidth: "190px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: "4px" }}>
            Health summary
          </div>
          <div style={{ opacity: 0.9 }}>
            Last visit: {patientInfo.lastVisit}
            <br />
            Status: <span style={{ fontWeight: 600 }}>Stable</span>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="cards-grid">
        <div className="card">
          <p className="card-title">Age / Gender</p>
          <p className="card-value">
            {patientInfo.age} yrs • {patientInfo.gender}
          </p>
        </div>
        <div className="card">
          <p className="card-title">Upcoming appointments</p>
          <p className="card-value">{nextAppointments.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Total reports</p>
          <p className="card-value">{reports.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Last visit</p>
          <p className="card-value">{patientInfo.lastVisit}</p>
        </div>
      </div>

      {/* BOTTOM GRID – left: reports, right: appointments */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.3fr",
          gap: "16px",
          marginTop: "18px",
        }}
      >
        {/* Recent Reports */}
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px" }}>Recent Reports</h3>
            <Link
              to="/patient/reports"
              style={{
                fontSize: "12px",
                color: "#0f66d1",
                textDecoration: "none",
              }}
            >
              View all
            </Link>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "6px 4px" }}>Report</th>
                <th style={{ padding: "6px 4px" }}>Date</th>
                <th style={{ padding: "6px 4px" }}>Doctor</th>
                <th style={{ padding: "6px 4px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "6px 4px" }}>{r.name}</td>
                  <td style={{ padding: "6px 4px" }}>{r.date}</td>
                  <td style={{ padding: "6px 4px" }}>{r.doctor}</td>
                  <td style={{ padding: "6px 4px" }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Upcoming appointments + quick links */}
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px" }}>Upcoming Appointments</h3>
            <Link
              to="/patient/appointments"
              style={{
                fontSize: "12px",
                color: "#0f66d1",
                textDecoration: "none",
              }}
            >
              View calendar
            </Link>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {nextAppointments.map((a) => (
              <li
                key={a.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  marginBottom: "8px",
                  fontSize: "12px",
                }}
              >
                <div style={{ fontWeight: 500 }}>
                  {a.date} • {a.time}
                </div>
                <div style={{ color: "#6b7280" }}>
                  {a.doctor} • {a.type}
                </div>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <Link
              to="/patient/reports"
              style={{
                padding: "8px 10px",
                borderRadius: "999px",
                background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                textDecoration: "none",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              View all reports
            </Link>
            <Link
              to="/patient/profile"
              style={{
                padding: "8px 10px",
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                color: "#0f172a",
                textDecoration: "none",
                fontSize: "12px",
                textAlign: "center",
              }}
            >
              Edit profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}