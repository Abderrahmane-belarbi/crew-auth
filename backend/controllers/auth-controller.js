import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {
  generateVerifcationToken,
  generateVerificationTokenExpiresAt,
} from "../utils/generate-verification-token.js";
import { generateTokenSetCookie } from "../utils/generate-token-cookie.js";
import { sendEmail } from "../utils/send-email.js";

export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(500).json({
        ok: false,
        message: "Email, password and name are required",
        data: {},
      });
    }

    const exist = await User.findOne({ email });
    if (exist)
      return res
        .status(500)
        .json({ ok: false, message: "Email already exist", data: {} });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerifcationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt,
    });

    // jwt
    const token = generateTokenSetCookie(res, createdUser._id);

    if (createdUser) {
      try {
        await sendEmail({
          to: createdUser.email,
          subject: "Verify your email",
          text: `Your verification code is ${verificationToken}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Thank you for signing up! Please use the verification code below to verify your email address:</p>
              <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                ${verificationToken}
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          `,
        });
        console.log("Verification email sent to:", createdUser.email);
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }

      return res.status(201).json({
        ok: true,
        message: "User created successfully",
        data: {
          // createdUser is a Mongoose Document, not a plain JavaScript object. save(), populate(), toObject(), toJSON()
          // createdUser._doc is the user data that we need
          ...createdUser._doc,
          password: undefined,
        },
      });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ ok: false, message: error.message, data: {} });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ok: false, message: "Email and password are required", data: {}});
    
    // we put Invalid credentials for both email and password for security reasons
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({ok: false, message: "Invalid credentials", data: {}});
 
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) return res.status(400).json({ok: false, message: "Invalid credentials", data: {}});

    // jwt
    generateTokenSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({ok: true, message: "User Logged in successfully", data: {
      ...user._doc,
      password: undefined
    }});
  
  } catch (error) {
    return res.status(500).json({ok: false, message: error.message, data: {}});
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ ok: true, message: "Logged out successfully", data: {} });
}

export async function verificationEmail(req, res) {
  try {
    const { verificationToken } = req.body;

    if(!verificationToken) 
      return res.status(500).json({ ok: false, message: "Required fields are missing", data: {} });
    
    const user = await User.findOne({ verificationToken });
    if (!user)
      return res.status(400).json({ ok: false, message: "User not found", data: {} });

    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return res.status(400).json({ ok: false, message: "No active verification token", data: {} });
    }

    if (Date.now() > new Date(user.verificationTokenExpiresAt).getTime()) {
      return res.status(400).json({ ok: false, message: "Token expired", data: {} });
    }

    if (String(user.verificationToken) !== String(verificationToken).trim()) {
      return res.status(400).json({ ok: false, message: "Wrong token", data: {} });
    }

    user.isVerified = true;
    user.verificationTokenExpiresAt = undefined;
    user.verificationToken = undefined;

    await user.save();

    return res.status(200).json({
      ok: true,
      message: "The email has been verified successfully",
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message, data: {} });
  }
}
