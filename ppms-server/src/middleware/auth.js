// src/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_later";

export function requireAuth(allowedRoles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET);

      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = payload; // { sub, role }
      next();
    } catch (err) {
      console.error("Auth error", err);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
}