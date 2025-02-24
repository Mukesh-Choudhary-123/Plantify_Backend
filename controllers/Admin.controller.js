import bcrypt from "@node-rs/bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

//#region Create Admin

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field are required.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(403).json({
        success: false,
        message: "email is already login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  } catch (error) {
    return res.status(403).json({ success: true, message: "error" });
  }
};

//#region Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field are required.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = await jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${admin.username}`,
      });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "login catch",
    });
  }
};

//#region Logout

export const logout = async (req,res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error while logout",
    });
  }
};
