import User from "../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  generateVerifcationToken,
  generateVerificationTokenExpiresAt,
} from "../utils/generate-verification-token.js";
import { generateTokenSetCookie } from "../utils/generate-token-cookie.js";
import { sendEmail } from "../utils/send-email.js";

export async function checkAuth(req, res) {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ ok: false, message: "User not found", data: {} });
    return res
      .status(200)
      .json({ ok: true, message: "User found", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: error.message, data: {} });
  }
}

export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "Email, password and name are required",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ message: "Email already exist" });
    }

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
        // Send Verification Email
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
      } catch (emailError) {
        console.error("Failed to send verification email:", emailError);
      }

      return res.status(201).json({
        message: "User created successfully, Please verify your email.",
        user: {
          // createdUser is a Mongoose Document, not a plain JavaScript object. save(), populate(), toObject(), toJSON()
          // createdUser._doc is the user data that we need
          _id: createdUser._id,
          name: createdUser.name,
          email: createdUser.email,
          isVerified: createdUser.isVerified,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    // we put Invalid credentials for both email and password for security reasons
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email before logging in" });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // jwt
    generateTokenSetCookie(res, user._id);
    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      message: "User Logged in successfully",
      data: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  res
    .status(200)
    .json({ ok: true, message: "Logged out successfully", data: {} });
}

export async function resendVerificationEmail(req, res) {
  try {
    const { email, resetCooldown } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    let remainingSeconds = 0;

    if(user.verificationResendAvailableAt) {
      const availableAt = user.verificationResendAvailableAt.getTime(); // milliseconds
      remainingSeconds = Math.max(
        0,
        Math.ceil((availableAt - Date.now()) / 1000),
      );
    }

    if(remainingSeconds > 0) {
      return res.status(400).json({ message: `You can request a new verification code in ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''}.` });
    }

    const verificationToken = generateVerifcationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = verificationTokenExpiresAt;
    user.verificationResendAvailableAt = new Date(Date.now() + resetCooldown * 1000);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is ${verificationToken}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Email Verification</h2>
          <p>Use the verification code below to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${verificationToken}
          </div>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `,
    });
    return res
      .status(200)
      .json({ message: "Verification code resent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function verificationEmail(req, res) {
  try {
    const { code, email } = req.body;
    if (!code || !email)
      return res.status(400).json({ message: "Required fields are missing" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Please Signup first" });

    if (user.isVerified)
      return res.status(410).json({ message: "Email already verified" });

    if (!user.verificationToken || !user.verificationTokenExpiresAt) {
      return res.status(400).json({ message: "No active verification token" });
    }

    if (String(user.verificationToken) !== String(code))
      return res.status(400).json({ message: "Invalid verification code" });

    if (Date.now() > new Date(user.verificationTokenExpiresAt).getTime()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.isVerified = true;
    user.verificationTokenExpiresAt = undefined;
    user.verificationToken = undefined;

    await user.save();

    return res.status(200).json({
      message: "The email has been verified successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ ok: false, message: "User not found", data: {} });

    // Generate reset token and hash it for security
    const resetPasswordToken = crypto.randomUUID();
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetPasswordToken)
      .digest("hex");
    // Update user token
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiresAt = Date.now() + 10 * 60 * 1000; // expires in 10 min
    await user.save();

    // Send email to user resetPasswordToken not the hashed
    // Send the raw token to the user in the link
    // When user comes back with raw token, you hash it and compare to DB
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      text: `You requested a password reset. Use this link to reset your password: ${resetUrl} (expires in 10 minutes). If you didn't request this, ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.5;">
          <h2 style="margin-bottom: 8px;">Reset your password</h2>
          <p style="margin-top: 0;">
            We received a request to reset your password. Click the button below to choose a new one.
          </p>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}"
              style="display: inline-block; background: #111827; color: #ffffff; padding: 12px 18px; border-radius: 10px; text-decoration: none; font-weight: 600;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            This link expires in <b>10 minutes</b>.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            If the button doesn’t work, copy and paste this link into your browser:
          </p>
          <p style="font-size: 14px; word-break: break-all; margin-top: 8px;">
            <a href="${resetUrl}">${resetUrl}</a>
          </p>

          <p style="color: #6b7280; font-size: 14px; margin-top: 18px;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res
      .status(200)
      .json({
        ok: true,
        message: "Password reset link sent to your email",
        data: {},
      });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: error.message, data: {} });
  }
}

export async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if (!password)
      return res
        .status(400)
        .json({ ok: false, message: "Password required", data: {} });
    if (!token)
      return res
        .status(400)
        .json({ ok: false, message: "Token required", data: {} });

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiresAt: {
        $gt: Date.now(), // find the user if thier token not expires by check gt: grater than
      },
    });

    if (!user)
      return res
        .status(400)
        .json({
          ok: false,
          message: "Invalid or expired reset password token",
          data: {},
        });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    return res
      .status(200)
      .json({ ok: true, message: "Password reset successfully", data: {} });
  } catch (error) {
    return res
      .status(500)
      .json({ ok: false, message: error.message, data: {} });
  }
}
