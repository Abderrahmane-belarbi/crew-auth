import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if(!token) return res.status(401).json({ok: false, message: "Unauthorized - no token provided", data: {}});
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ok: false, message: "Unauthorized - invalid token", data: {}});
  }
}