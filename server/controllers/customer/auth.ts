import { Request, Response } from "express";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Customer = require("../../models/customer");
const crypto = require("crypto");
const sendEmail = require("../../utils/email");

const sameSiteValue: "lax" | "strict" | "none" | undefined =
  process.env.SAME_SITE === "lax" ||
  process.env.SAME_SITE === "strict" ||
  process.env.SAME_SITE === "none"
    ? process.env.SAME_SITE
    : undefined;

const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "4d",
  });
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const user = await Customer.findById(req.user.userId).select("-password"); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await Customer.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "4d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: sameSiteValue,
      maxAge: 4 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
    });
    res.json({ success: true, user, token });
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
    const existingUser = await Customer.findOne({ username });

    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" }); // Use return to prevent further execution
    }

    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const newUser = new Customer({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
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
    domain: process.env.COOKIE_DOMAIN,
  });

  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  // 1) Get user based on POSTed email
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Please provide an email address" });
  }

  const user = await Customer.findOne({ email });

  // 2) Generate the random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 3) Hash the token and set it in the user document
  if (user) {
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // 4) Send it to user's email
    try {
      const resetURL = `${process.env.REACT_APP_URL}/reset-password/${resetToken}`;

      const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #0D4D8D; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested a password reset for your Afro Royals account.</p>
          <p>Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetURL}" style="background-color: #0D4D8D; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request a password reset, please ignore this email.</p>
          <p>Thank you,<br>Afro Royals Team</p>
        </div>
      `;

      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
        html,
      });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        message: "There was an error sending the email. Try again later!",
      });
    }
  }

  // Always send a success response even if the email doesn't exist (security)
  res.status(200).json({
    status: "success",
    message:
      "If your email is registered with us, you will receive a password reset link shortly.",
  });
};

// @desc    Reset password
// @route   PATCH /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req: Request, res: Response) => {
  // 1) Get user based on the token
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Please provide a new password" });
  }

  const saltRounds = 10;

  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Customer.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired" });
  }

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // This is handled by a pre-save middleware in the user model

  // 4) Log the user in, send JWT
  const jwtToken = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: jwtToken,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
};
