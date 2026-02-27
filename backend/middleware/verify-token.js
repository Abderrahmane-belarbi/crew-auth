import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({ error: "Unauthorized - no token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized - invalid token" });
  }
}