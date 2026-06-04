import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function DoctorDashboard() {
  const { user } = useAuth();

  const doctorInfo = {
    name: user?.name || "Dr. Neha Sharma",
    specialization: "Cardiologist",
    qualification: "MBBS, MD (Cardiology)",
    experience: "8+ years",
    hospital: "Sun Fibo Multispeciality Hospital",
  };

  const todayAppointments = [
    { id: 1, time: "09:30 AM", patient: "Rahul Patil", reason: "Chest pain", room: "C-101" },
    { id: 2, time: "11:00 AM", patient: "Sneha Joshi", reason: "Follow up", room: "C-103" },
    { id: 3, time: "02:15 PM", patient: "Aman Khan", reason: "ECG review", room: "C-102" },
  ];

  const patients = [
    { id: "PT-2026-001", name: "Rahul Patil", age: 32, gender: "Male", lastVisit: "20 May 2026" },
    { id: "PT-2026-002", name: "Sneha Joshi", age: 29, gender: "Female", lastVisit: "18 May 2026" },
    { id: "PT-2026-003", name: "Aman Khan", age: 41, gender: "Male", lastVisit: "10 May 2026" },
  ];

  return (
    <div style={{ padding: "8px 4px" }}>
      {/* Top doctor profile banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0f66d1,#1d4ed8)",
          borderRadius: 24,
          padding: "20px 22px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          gap: 18,
          boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
          marginBottom: 18,
          flexWrap: "wrap",          // allow wrap on small screens
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center", minWidth: 0, flex: 1 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {doctorInfo.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Doctor</div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                margin: "0 0 4px",
              }}
            >
              {doctorInfo.name}
            </h1>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              {doctorInfo.specialization} • {doctorInfo.qualification}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 4 }}>
              Experience: {doctorInfo.experience}
            </div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>
              {doctorInfo.hospital}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "10px 14px",
            borderRadius: 18,
            background: "rgba(15,23,42,0.25)",
            fontSize: 12,
            minWidth: 210,
            flexShrink: 0,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            Today&apos;s summary
          </div>
          <div style={{ opacity: 0.9 }}>
            Appointments: <b>{todayAppointments.length}</b>
            <br />
            Total patients assigned: <b>{patients.length}</b>
          </div>
          <Link
            to="/doctor/patients"
            style={{
              display: "inline-block",
              marginTop: 6,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.9)",
              color: "white",
              textDecoration: "none",
              fontSize: 11,
            }}
          >
            View all patients
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="cards-grid">
        <div className="card">
          <p className="card-title">Today&apos;s appointments</p>
          <p className="card-value">{todayAppointments.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Total patients</p>
          <p className="card-value">{patients.length}</p>
        </div>
        <div className="card">
          <p className="card-title">Pending reports</p>
          <p className="card-value">3</p>
        </div>
        <div className="card">
          <p className="card-title">Messages</p>
          <p className="card-value">5</p>
        </div>
      </div>

      {/* Bottom grid: Today appointments + patients list preview */}
      <div
        className="doctor-bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1.5fr",
          gap: 16,
          marginTop: 18,
        }}
      >
        {/* Today appointments table */}
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              gap: 8,
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>Today&apos;s Appointments</h3>
            <Link
              to="/doctor/appointments"
              style={{
                fontSize: 12,
                color: "#0f66d1",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View schedule
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Patient</th>
                  <th>Reason</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.time}</td>
                    <td>{a.patient}</td>
                    <td>{a.reason}</td>
                    <td>{a.room}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patients preview + quick links */}
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
              gap: 8,
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16 }}>My Patients</h3>
            <Link
              to="/doctor/patients"
              style={{
                fontSize: 12,
                color: "#0f66d1",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              View all
            </Link>
          </div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {patients.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "8px 10px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  marginBottom: 8,
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>{p.name}</div>
                  <div style={{ color: "#6b7280" }}>
                    {p.age} yrs • {p.gender} • Last visit {p.lastVisit}
                  </div>
                </div>
                <Link
                  to={`/doctor/patient/${p.id}`}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid #0f66d1",
                    color: "#0f66d1",
                    textDecoration: "none",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                  }}
                >
                  View profile
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Small CSS helper for stacking bottom grid on mobile */}
      <style>
        {`
          @media (max-width: 768px) {
            .doctor-bottom-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </div>
  );
}