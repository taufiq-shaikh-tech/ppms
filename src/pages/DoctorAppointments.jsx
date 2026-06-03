// src/pages/DoctorAppointments.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function DoctorAppointments() {
  const { authFetch, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await authFetch("http://localhost:5000/api/appointments/my");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load appointments");
      }
      setAppointments(data);
    } catch (err) {
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id, status) => {
    setError("");
    setUpdatingId(id);
    try {
      const res = await authFetch(
        `http://localhost:5000/api/appointments/${id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update status");
      }
      // update list locally
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: data.status } : a))
      );
    } catch (err) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
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
              fontSize: "11px",
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
              fontSize: "11px",
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
              fontSize: "11px",
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
              fontSize: "11px",
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
      <span style={{ textTransform: "capitalize" }}>
        {a.status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="page-title">Doctor Appointments</h1>
      <p className="page-subtitle">
        Appointments assigned to you, with quick status controls.
      </p>

      {error && (
        <p style={{ color: "#fecaca", fontSize: "13px", marginBottom: "8px" }}>
          {error}
        </p>
      )}

      <div className="section">
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
          My appointments ({user?.role})
        </h3>

        {loading ? (
          <p style={{ fontSize: "13px" }}>Loading...</p>
        ) : appointments.length === 0 ? (
          <p style={{ fontSize: "12px", color: "#6b7280" }}>
            No appointments assigned yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "12px",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left", color: "#6b7280" }}>
                <th style={{ padding: "8px 4px" }}>Date</th>
                <th style={{ padding: "8px 4px" }}>Patient</th>
                <th style={{ padding: "8px 4px" }}>Reason</th>
                <th style={{ padding: "8px 4px" }}>Status</th>
                <th style={{ padding: "8px 4px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 4px" }}>
                    {new Date(a.date).toLocaleString()}
                  </td>
                  <td style={{ padding: "8px 4px" }}>{a.patient?.name}</td>
                  <td style={{ padding: "8px 4px" }}>{a.reason}</td>
                  <td
                    style={{
                      padding: "8px 4px",
                      textTransform: "capitalize",
                    }}
                  >
                    {a.status}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {renderStatusActions(a)}
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