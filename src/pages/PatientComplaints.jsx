// src/pages/PatientComplaints.jsx
import { useState } from "react";

export default function PatientComplaints() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      date: "28 May 2026",
      doctor: "Dr. Arjun Mehta",
      category: "Behaviour",
      summary:
        "Doctor was in a hurry and did not explain my X-ray report properly.",
      status: "Open",
    },
  ]);

  const [form, setForm] = useState({
    doctor: "",
    category: "",
    summary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.doctor || !form.category || !form.summary.trim()) return;

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newComplaint = {
      id: complaints.length + 1,
      date: dateStr,
      doctor: form.doctor,
      category: form.category,
      summary: form.summary.trim(),
      status: "Open",
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    setForm({ doctor: "", category: "", summary: "" });

    // Backend ke baad yahan API call hoga jisse complaint DB me store hogi [web:126][web:129][web:130].
    alert("Your complaint has been submitted to the admin (frontend demo).");
  };

  return (
    <div>
      <h1 className="page-title">Complaints</h1>
      <p className="page-subtitle">
        If you faced any issue with a doctor or service, you can report it to
        the admin here.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1.9fr",
          gap: "16px",
        }}
      >
        {/* Complaint form */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
            Submit complaint to admin
          </h3>

          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              Doctor name
              <input
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                placeholder="e.g. Dr. Neha Sharma"
                required
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "8px",
              }}
            >
              Category
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              >
                <option value="">Select category</option>
                <option value="Behaviour">Behaviour</option>
                <option value="Delay">Delay</option>
                <option value="Treatment">Treatment issue</option>
                <option value="Billing">Billing / charges</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label
              style={{
                display: "block",
                fontSize: "13px",
                marginBottom: "10px",
              }}
            >
              Complaint details
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                rows={4}
                placeholder="Describe what happened..."
                required
                style={{
                  width: "100%",
                  marginTop: "4px",
                  padding: "7px 10px",
                  borderRadius: "10px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "9px 0",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Submit complaint
            </button>
          </form>
        </div>

        {/* Patient's own complaints list */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
            Your complaints status
          </h3>
          {complaints.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              You have not submitted any complaints yet.
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
                  <th style={{ padding: "8px 4px" }}>Doctor</th>
                  <th style={{ padding: "8px 4px" }}>Category</th>
                  <th style={{ padding: "8px 4px" }}>Summary</th>
                  <th style={{ padding: "8px 4px" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td style={{ padding: "8px 4px" }}>{c.date}</td>
                    <td style={{ padding: "8px 4px" }}>{c.doctor}</td>
                    <td style={{ padding: "8px 4px" }}>{c.category}</td>
                    <td
                      style={{
                        padding: "8px 4px",
                        maxWidth: "260px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.summary}
                    </td>
                    <td
                      style={{
                        padding: "8px 4px",
                        color:
                          c.status === "Open"
                            ? "#b91c1c"
                            : c.status === "In review"
                            ? "#b45309"
                            : "#15803d",
                        fontWeight: 600,
                      }}
                    >
                      {c.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}