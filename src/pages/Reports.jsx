// src/pages/Reports.jsx
import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { useAuth } from "../context/AuthContext";

export default function Reports() {
  const { authFetch, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const patientId = user?.id; // logged-in patient

  const loadReports = async () => {
    if (!patientId) return;
    setLoading(true);
    setError("");
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
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleDownload = (report) => {
    if (report.filePath) {
      const url = `http://localhost:5000/${report.filePath}`;
      window.open(url, "_blank");
    } else {
      alert("File not available");
    }
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !patientId) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("owner", patientId); // patient whose portal this is
      if (title) formData.append("title", title);
      if (notes) formData.append("notes", notes);

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

      // reset form
      setFile(null);
      setTitle("");
      setNotes("");

      // reload list or push new item
      setReports((prev) => [data, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to upload report");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Medical Reports</h1>
      <p className="page-subtitle">
        Upload and view your medical reports. Your doctors can also add reports here.
      </p>

      {error && (
        <p style={{ color: "#b91c1c", fontSize: "13px", marginBottom: "6px" }}>
          {error}
        </p>
      )}

      {/* Upload section */}
      <div className="section" style={{ marginBottom: "14px" }}>
        <h3 style={{ marginTop: 0, fontSize: "15px" }}>Upload report</h3>
        <p style={{ fontSize: "12px", color: "#6b7280", marginTop: 2 }}>
          You can upload PDFs or images from your previous tests.
        </p>

        <form
          onSubmit={handleUpload}
          style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: "12px" }}
              accept=".pdf,image/*"
            />
            <input
              type="text"
              placeholder="Title (e.g. Blood test, X-ray)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                flex: 1,
                minWidth: 180,
                borderRadius: 999,
                border: "1px solid #d1d5db",
                padding: "6px 10px",
                fontSize: "12px",
              }}
            />
          </div>
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={{
              borderRadius: 10,
              border: "1px solid #d1d5db",
              padding: "6px 10px",
              fontSize: "12px",
              resize: "vertical",
            }}
          />
          <div>
            <button
              type="submit"
              disabled={uploading || !file}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "none",
                background: uploading
                  ? "#9ca3af"
                  : "linear-gradient(90deg,#0f66d1,#1d4ed8)",
                color: "white",
                fontSize: "12px",
                cursor: uploading || !file ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Upload report"}
            </button>
          </div>
        </form>
      </div>

      {/* Reports list */}
      <div className="section">
        {loading ? (
          <p style={{ fontSize: "13px" }}>Loading...</p>
        ) : reports.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#6b7280" }}>
            No reports yet. You or your doctor can upload reports here.
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
                  <td style={{ padding: "8px 4px", fontWeight: 500 }}>
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
                        background: "linear-gradient(90deg,#0f66d1,#1d4ed8)",
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

      {/* View modal */}
      <Modal
        open={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title={selectedReport ? selectedReport.title || selectedReport.fileName : ""}
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