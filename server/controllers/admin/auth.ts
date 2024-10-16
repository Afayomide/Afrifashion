import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Admin = require("../../models/admin");

const sameSiteValue: "lax" | "strict" | "none" | undefined = 
    process.env.SAME_SITE === "lax" || 
    process.env.SAME_SITE === "strict" || 
    process.env.SAME_SITE === "none" 
    ? process.env.SAME_SITE 
    : undefined; 

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findById(req.user.userId).select("-password"); // Exclude password field
    if (!admin) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(sameSiteValue)
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteValue,
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });
    console.log(res.cookie);
    res.json({ success: true, admin });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const signUp = async (req: Request, res: Response) => {
  const { fullname, username, email, password } = req.body;

  if (!username || !password || !fullname || !email) {
    return res.json({ success: false, message: "All fields are required" }); // Use return to prevent further execution
  }

  try {
    const existingAdmin = await Admin.findOne({ username });

    if (existingAdmin) {
      return res.json({ success: false, message: "Username already exists" }); // Use return to prevent further execution
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newAdmin = new Admin({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    return res.json({ success: true });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.json({ success: false, message: "Internal server error" });
  }
};

export const logOut = async (req: Request, res: Response) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production for HTTPS
    sameSite: sameSiteValue,
    maxAge: 0,
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};
