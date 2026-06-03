// src/pages/DoctorPatientDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function DoctorPatientDetail() {
  const { id: patientId } = useParams();
  const { authFetch } = useAuth();

  const [patient, setPatient] = useState({
    id: patientId,
    name: "Selected patient",
    age: null,
    gender: "",
    bloodGroup: "",
    conditions: "",
    allergies: "",
  });

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  // simple note/chat (abhi local state, real chat DoctorMessages page pe)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // new: upload + create via new backend
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [createForm, setCreateForm] = useState({
    title: "",
    notes: "",
  });

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  // ===== Reports load (new API) =====
  const loadReports = async () => {
    if (!patientId) return;
    setReportsLoading(true);
    setReportsError("");
    try {
      const res = await authFetch(
        `http://localhost:5000/api/reports/user/${patientId}`
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load reports");
      }
      setReports(data);
    } catch (err) {
      setReportsError(err.message || "Failed to load reports");
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  // ===== Local note/chat (optional, UI only) =====
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, from: "doctor", text: newMessage.trim() },
    ]);
    setNewMessage("");
  };

  // ===== File download (new backend) =====
  const handleDownload = (report) => {
    if (report.filePath) {
      const url = `http://localhost:5000/${report.filePath}`;
      window.open(url, "_blank");
    } else {
      alert("File not available");
    }
  };

  // ===== File upload + create report (new backend) =====
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
  };

  const handleCreateReport = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!file) {
      setCreateError("Please select a file (PDF or image)");
      return;
    }

    if (!createForm.title.trim()) {
      setCreateError("Report title is required");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("owner", patientId); // patient whose portal this is
      formData.append("title", createForm.title.trim());
      if (createForm.notes.trim()) {
        formData.append("notes", createForm.notes.trim());
      }

      const res = await authFetch(
        "http://localhost:5000/api/reports/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload report");
      }

      // Add to list
      setReports((prev) => [data, ...prev]);

      // reset form
      setFile(null);
      setCreateForm({ title: "", notes: "" });
      e.target.reset();
    } catch (err) {
      setCreateError(err.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div>
      {/* Header */}
      <h1 className="page-title">
        Patient: {patient.name} ({patient.id})
      </h1>
      <p className="page-subtitle">
        View history and manage reports for this patient.
      </p>

      {/* Top: patient info + small note area */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1.8fr",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        {/* Patient info */}
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
              {patient.name?.charAt(0) || "P"}
            </div>
            <div>
              <div style={{ fontSize: "13px", color: "#6b7280" }}>
                ID: {patient.id}
              </div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                {patient.name}
              </div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>
                {patient.age
                  ? `${patient.age} yrs • ${patient.gender} • Blood group ${patient.bloodGroup}`
                  : "Basic info from backend (optional)"}
              </div>
            </div>
          </div>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Conditions: {patient.conditions || "N/A"}
          </p>
          <p style={{ fontSize: "13px", color: "#4b5563" }}>
            Allergies: {patient.allergies || "N/A"}
          </p>
        </div>

        {/* Small note/chat (UI only) */}
        <div className="section">
          <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
            Notes with {patient.name}
          </h3>
          <div
            style={{
              height: "180px",
              borderRadius: "10px",
              border: "1px solid #e5e7eb",
              padding: "8px",
              fontSize: "12px",
              marginBottom: "8px",
              overflowY: "auto",
              background: "#f9fafb",
            }}
          >
            {messages.length === 0 ? (
              <p
                style={{
                  fontSize: "12px",
                  color: "#9ca3af",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                Use the Messages section for real chat with this patient.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      m.from === "doctor" ? "flex-end" : "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "75%",
                      padding: "6px 9px",
                      borderRadius: "12px",
                      background:
                        m.from === "doctor"
                          ? "linear-gradient(90deg,#0f66d1,#1d4ed8)"
                          : "white",
                      color: m.from === "doctor" ? "white" : "#111827",
                      fontSize: "12px",
                      border:
                        m.from === "doctor" ? "none" : "1px solid #e5e7eb",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a quick note..."
              style={{
                flex: 1,
                borderRadius: "999px",
                border: "1px solid #d1d5db",
                padding: "8px 10px",
                fontSize: "12px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "none",
                background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* CREATE REPORT + UPLOAD (new backend) */}
      <div className="section" style={{ marginBottom: "16px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>
          Add report for {patient.name} ({patient.id})
        </h3>
        {createError && (
          <p
            style={{
              color: "#b91c1c",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            {createError}
          </p>
        )}
        <form
          onSubmit={handleCreateReport}
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <div>
            <label style={{ fontSize: "12px" }}>
              Report title
              <input
                name="title"
                value={createForm.title}
                onChange={handleCreateChange}
                placeholder="e.g. CBC Report, X‑Ray Chest"
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: "6px 8px",
                  borderRadius: 999,
                  border: "1px solid #d1d5db",
                  fontSize: "12px",
                }}
              />
            </label>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "12px" }}>
              Notes (optional)
              <textarea
                name="notes"
                value={createForm.notes}
                onChange={handleCreateChange}
                placeholder="Summary of lab result or key notes..."
                rows={3}
                style={{
                  width: "100%",
                  marginTop: 4,
                  padding: "6px 8px",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  fontSize: "12px",
                  resize: "vertical",
                }}
              />
            </label>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: "12px" }}>
              Upload PDF or image
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileChange}
                style={{
                  width: "100%",
                  marginTop: 4,
                  fontSize: "12px",
                }}
              />
            </label>
            {uploading && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                Uploading report...
              </p>
            )}
          </div>

          <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
            <button
              type="submit"
              disabled={uploading}
              style={{
                padding: "7px 16px",
                borderRadius: 999,
                border: "none",
                background: uploading
                  ? "#9ca3af"
                  : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Saving..." : "Save report"}
            </button>
          </div>
        </form>
      </div>

      {/* Reports table (using new backend data) */}
      <div className="section">
        <h3 style={{ marginTop: 0, marginBottom: "8px" }}>Reports</h3>
        {reportsError && (
          <p
            style={{
              color: "#b91c1c",
              fontSize: "12px",
              marginBottom: "6px",
            }}
          >
            {reportsError}
          </p>
        )}
        {reportsLoading ? (
          <p style={{ fontSize: "12px" }}>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p style={{ fontSize: "12px", color: "#6b7280" }}>
            No reports yet for this patient.
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
                <th style={{ padding: "8px 4px" }}>Report</th>
                <th style={{ padding: "8px 4px" }}>Date</th>
                <th style={{ padding: "8px 4px" }}>Uploaded by</th>
                <th style={{ padding: "8px 4px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id} style={{ borderTop: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "8px 4px" }}>
                    {r.title || r.fileName}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {formatDate(r.createdAt)}
                  </td>
                  <td style={{ padding: "8px 4px" }}>
                    {r.uploadedBy?.name
                      ? `${r.uploadedBy.name} (${r.uploadedBy.role})`
                      : "-"}
                  </td>
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
        )}
      </div>

      {/* Report view modal */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={
          selectedReport
            ? selectedReport.title || selectedReport.fileName
            : ""
        }
      >
        {selectedReport && (
          <div>
            <p style={{ fontSize: "12px", color: "#6b7280" }}>
              {formatDate(selectedReport.createdAt)} •{" "}
              {selectedReport.uploadedBy?.name
                ? `${selectedReport.uploadedBy.name} (${selectedReport.uploadedBy.role})`
                : "Unknown uploader"}
            </p>
            {selectedReport.notes && (
              <p style={{ fontSize: "13px", marginBottom: "10px" }}>
                {selectedReport.notes}
              </p>
            )}
            <div
              style={{
                height: "360px",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            >
              {selectedReport.filePath ? (
                <iframe
                  src={`http://localhost:5000/${selectedReport.filePath}`}
                  title={selectedReport.title || selectedReport.fileName}
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "12px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  File preview not available.
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}