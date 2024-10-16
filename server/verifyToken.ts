const express = require("express");
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const app = express();

const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());

function verifyAdminToken(req: Request, res: Response, next: any) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
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

function verifyToken(req: Request, res: Response, next: any) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
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

module.exports = {
  verifyToken,
  verifyAdminToken,
};
