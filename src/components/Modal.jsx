export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "12px", // mobile ke liye thoda breathing space
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "720px",
          maxHeight: "80vh",
          background: "white",
          borderRadius: "18px",
          overflow: "hidden",
          boxShadow: "0 24px 70px rgba(15,23,42,0.6)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: 0, fontSize: "15px" }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
        <div
          style={{
            padding: "12px 16px",
            flex: 1,
            overflow: "auto",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}