import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({ok: false, message: "Unauthorized - no token provided", data: {}});
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded) return res.status(401).json({ok: false, message: "Unauthorized - invalid token", data: {}});
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(500).json({ok: false, message: error.message, data: {}});
  }
}