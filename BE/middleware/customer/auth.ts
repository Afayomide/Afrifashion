import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(express.json());

export function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.admin = decoded;
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn("JWT has expired!");
      return res
        .status(401)
        .json({ message: "Your session has expired. Please log in again." });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded;
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      console.warn("JWT has expired!");
      return res
        .status(401)
        .json({ message: "Your session has expired. Please log in again." });
    }
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
}


