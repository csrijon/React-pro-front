import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  // ─── SAFE PATCH: Evaluated dynamically per request after env is fully loaded ───
  const JWT_SECRET = process.env.JWT_SECRET || "fallback_super_secure_key_node_2026";
  
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access token missing from request headers." });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedPayload) => {
    if (err) {
      return res
        .status(403)
        .json({
          message: "Session expired or validation token signature is invalid.",
        });
    }
    req.user = decodedPayload;
    next();
  });
};