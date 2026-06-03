import { useParams } from "react-router-dom";
import { useState } from "react";
import Modal from "../components/Modal";

export default function DoctorPatientDetail() {
  const { id } = useParams();

  const patient = {
    id,
    name: "Rahul Patil",
    age: 32,
    gender: "Male",
    bloodGroup: "B+",
    conditions: "Hypertension",
    allergies: "No known allergies",
  };

  const reports = [
    {
      id: 1,
      name: "CBC Report",
      date: "10 May 2026",
      status: "Normal",
      fileUrl: "/dummy/cbc.pdf",
    },
    {
      id: 2,
      name: "ECG",
      date: "05 May 2026",
      status: "Reviewed",
      fileUrl: "/dummy/ecg.pdf",
    },
  ];

  const [selectedReport, setSelectedReport] = useState(null);

  const handleDownload = (report) => {
    alert(`Doctor downloading: ${report.name}`);
  };

  return (
    <div>
      <h1 className="page-title">Patient: {patient.name}</h1>
      <p className="page-subtitle">
        View profile, reports and communicate with the patient.
      </p>

      {/* top: basic info + conditions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1.7fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div className="section">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#e0ecff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                fontWeight: "bold",
                color: "#0f66d1",
              }}
            >
              {patient.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                ID: {patient.id}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                {patient.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {patient.age} yrs • {patient.gender} • Blood group {patient.bloodGroup}
              </div>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Conditions: {patient.conditions}
          </p>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Allergies: {patient.allergies}
          </p>
        </div>

        {/* chat UI placeholder */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Secure Messages</h3>
          <div
            style={{
              height: "140px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              padding: "8px",
              fontSize: "12px",
              color: "#6b7280",
              marginBottom: "8px",
            }}
          >
            {/* yaha backend ke baad messages list aayegi */}
            No messages yet. Start a conversation with the patient.
          </div>
          <textarea
            rows={3}
            placeholder="Type your message to the patient..."
            style={{
              width: "100%",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              padding: "8px",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          />
          <button
            style={{
              padding: "7px 14px",
              borderRadius: "999px",
              border: "none",
              background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
              color: "white",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onClick={() => alert("Message sending will work after backend")}
          >
            Send message
          </button>
        </div>
      </div>

      {/* Reports list for this patient */}
      <div className="section">
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Reports</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#6b7280" }}>
              <th style={{ padding: "8px 4px" }}>Report</th>
              <th style={{ padding: "8px 4px" }}>Date</th>
              <th style={{ padding: "8px 4px" }}>Status</th>
              <th style={{ padding: "8px 4px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "8px 4px" }}>{r.name}</td>
                <td style={{ padding: "8px 4px" }}>{r.date}</td>
                <td style={{ padding: "8px 4px" }}>{r.status}</td>
                <td style={{ padding: "8px 4px" }}>
                  <button
                    onClick={() => setSelectedReport(r)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "999px",
                      border: "1px solid #0f66d1",
                      background: "white",
                      color: "#0f66d1",
                      fontSize: "11px",
                      cursor: "pointer",
                      marginRight: "6px",
                    }}
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(r)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "999px",
                      border: "none",
                      background:
                        "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                      color: "white",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report view modal (same idea as patient side) */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? selectedReport.name : ""}
      >
        {selectedReport && (
          <div>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {selectedReport.date} • Status: {selectedReport.status}
            </p>
            <div
              style={{
                height: "360px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background:
                  "repeating-linear-gradient(45deg,#f9fafb,#f9fafb 10px,#e5e7eb 10px,#e5e7eb 20px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              PDF preview for this report will appear here after backend.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}