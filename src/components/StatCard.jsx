// src/components/StatCard.jsx
export default function StatCard({
  title,
  value,
  note,
  color = "#22c55e", // default green
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        boxShadow: "0 1px 2px rgba(15,23,42,0.05)",
        border: "1px solid #e5e7eb",
        padding: 16,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: color,
          marginBottom: 16,
        }}
      ></div>
      <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{title}</p>
      <h3
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#0f172a",
          margin: "4px 0 0",
        }}
      >
        {value}
      </h3>
      <p
        style={{
          fontSize: 12,
          color: "#9ca3af",
          margin: "8px 0 0",
        }}
      >
        {note}
      </p>
    </div>
  );
}