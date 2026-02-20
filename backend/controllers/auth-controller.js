import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateVerifcationToken, generateVerificationTokenExpiresAt } from "../utils/generate-verification-token.js";
import { generateTokenSetCookie } from "../utils/generate-token-cookie.js";

export async function signup(req, res) {
  try {
    const { email, password, name } = req.body;
    if(!email || !password || !name) {
      return res.status(500).json({ok: false, message: "Email, password and name are required", data: {}})
    };

    const exist = await User.findOne({email});
    if(exist) return res.status(500).json({ok: false, message: "Email already exist", data: {}})

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerifcationToken();
    const verificationTokenExpiresAt = generateVerificationTokenExpiresAt();


    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt
    });

    // jwt
    const token = generateTokenSetCookie(res, createdUser._id);

    if(createdUser) return res.status(201).json({
      ok: true,
      message: "User created successfully",
      data: {
        // createdUser is a Mongoose Document, not a plain JavaScript object. save(), populate(), toObject(), toJSON()
        // but createdUser._doc is the user data that we need 
        ...createdUser._doc, 
        password: undefined
      } 
    });
  } catch (error) {
    return res.status(400).json({ok: false, message: error.message, data: {}})
  }
}

export function login(req, res) {
  res.send("Login Page");
}

export function logout(req, res) {
  res.send("Logout Page");
}