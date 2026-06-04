// src/pages/DoctorAppointments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_ROOT =
  import.meta.env.VITE_API_ROOT || "https://ppms-server-3.onrender.com";

export default function DoctorAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Dummy patients for doctor view
  const STATIC_PATIENTS = [
    {
      id: "pt_rahul",
      name: "Rahul Mehta",
      age: 32,
    },
    {
      id: "pt_ananya",
      name: "Ananya Gupta",
      age: 27,
    },
  ];

  // Initial dummy appointments for doctor
  useEffect(() => {
    const today = new Date();
    const format = (d) => d.toISOString().slice(0, 10);

    const a1 = new Date(today);
    a1.setDate(a1.getDate() + 1);
    const a2 = new Date(today);
    a2.setDate(a2.getDate() + 2);

    const initial = [
      {
        _id: "doc_apt1",
        date: format(a1),
        time: "09:30 AM",
        patientId: STATIC_PATIENTS[0].id,
        reason: "Chest pain and breathlessness",
        status: "pending",
      },
      {
        _id: "doc_apt2",
        date: format(a2),
        time: "03:15 PM",
        patientId: STATIC_PATIENTS[1].id,
        reason: "Follow-up after surgery",
        status: "confirmed",
      },
    ];

    setAppointments(initial);
    setLoading(false);
  }, []);

  const getPatient = (id) =>
    STATIC_PATIENTS.find((p) => p.id === id) || null;

  const getPatientName = (id) => {
    const p = getPatient(id);
    return p ? p.name : "-";
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "#16a34a";
    if (status === "completed") return "#0f766e";
    if (status === "cancelled") return "#b91c1c";
    return "#92400e"; // pending
  };

  // Local status update (front-end only)
  const updateStatus = (id, status) => {
    setError("");
    setUpdatingId(id);
    try {
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === id ? { ...a, status } : a
        )
      );
    } catch (err) {
      setError("Failed to update status (local)");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMessagePatient = (appointment) => {
    const p = getPatient(appointment.patientId);
    navigate("/doctor/messages", {
      state: {
        patientId: appointment.patientId,
        patientName: p ? p.name : "Patient",
      },
    });
  };

  const renderStatusActions = (a) => {
    if (a.status === "pending") {
      return (
        <>
          <button
            onClick={() => updateStatus(a._id, "confirmed")}
            disabled={updatingId === a._id}
            style={{
              padding: "4px 8px",
              marginRight: 6,
              borderRadius: 999,
              border: "none",
              fontSize: 11,
              background: "#16a34a",
              color: "#f9fafb",
              cursor: updatingId === a._id ? "not-allowed" : "pointer",
            }}
          >
            Confirm
          </button>
          <button
            onClick={() => updateStatus(a._id, "cancelled")}
            disabled={updatingId === a._id}
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              border: "none",
              fontSize: 11,
              background: "#b91c1c",
              color: "#f9fafb",
              cursor: updatingId === a._id ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
        </>
      );
    }

    if (a.status === "confirmed") {
      return (
        <>
          <button
            onClick={() => updateStatus(a._id, "completed")}
            disabled={updatingId === a._id}
            style={{
              padding: "4px 8px",
              marginRight: 6,
              borderRadius: 999,
              border: "none",
              fontSize: 11,
              background: "#0f766e",
              color: "#f9fafb",
              cursor: updatingId === a._id ? "not-allowed" : "pointer",
            }}
          >
            Mark completed
          </button>
          <button
            onClick={() => updateStatus(a._id, "cancelled")}
            disabled={updatingId === a._id}
            style={{
              padding: "4px 8px",
              borderRadius: 999,
              border: "none",
              fontSize: 11,
              background: "#b91c1c",
              color: "#f9fafb",
              cursor: updatingId === a._id ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
        </>
      );
    }

    return (
      <span
        style={{
          textTransform: "capitalize",
          color: getStatusColor(a.status),
          fontWeight: 500,
          fontSize: 11,
        }}
      >
        {a.status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="page-title">Doctor Appointments</h1>
      <p className="page-subtitle">
        View your upcoming patient visits and manage their status.
      </p>

      {error && (
        <p style={{ color: "#fecaca", fontSize: 13, marginBottom: 8 }}>
          {error}
        </p>
      )}

      <div className="section">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 15 }}>
          My appointments ({user?.name || "Doctor"})
        </h3>

        {loading ? (
          <p style={{ fontSize: 13 }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ fontSize: 12, color: "#6b7280" }}>
            No appointments assigned yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 12,
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "8px 4px" }}>Date</th>
                <th style={{ padding: "8px 4px" }}>Time</th>
                <th style={{ padding: "8px 4px" }}>Patient</th>
                <th style={{ padding: "8px 4px" }}>Reason</th>
                <th style={{ padding: "8px 4px" }}>Status</th>
                <th style={{ padding: "8px 4px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 4px" }}>{a.date}</td>
                  <td style={{ padding: "8px 4px" }}>{a.time}</td>
                  <td style={{ padding: "8px 4px" }}>
                    {getPatientName(a.patientId)}
                  </td>
                  <td style={{ padding: "8px 4px" }}>{a.reason}</td>
                  <td
                    style={{
                      padding: "8px 4px",
                      textTransform: "capitalize",
                      color: getStatusColor(a.status),
                      fontWeight: 500,
                    }}
                  >
                    {a.status}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {renderStatusActions(a)}
                    <button
                      type="button"
                      onClick={() => handleMessagePatient(a)}
                      style={{
                        marginLeft: 6,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid #d1d5db",
                        background: "white",
                        fontSize: 11,
                        cursor: "pointer",
                      }}
                    >
                      Message patient
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}