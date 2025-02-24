import Seller from "../models/Seller.js";
import bcrypt from "@node-rs/bcrypt";
import jwt from "jsonwebtoken";

//#region create seller
export const signup = async (req,res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(403).json({
        success: false,
        message: "All field required.",
      });
    }

    const seller = await Seller.findOne({ email });

    if (seller) {
      return res.status(403).json({
        success: false,
        message: "Email Already used.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Seller.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Seller created successfully.",
    });
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "fail to sign-up.",
    });
  }
};

//#region login

export const login = async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All filed are required.",
      });
    }

    const seller = await Seller.findOne({ email });

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "Seller not found.",
      });
    }

    const isPasswordMatch = bcrypt.compare(password, seller.password);

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = await jwt.sign(
      { sellerId: seller._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
      
    return res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    })
    .json({
      success: true,
      message: `Welcome back ${seller.username}`,
    });
      
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "fail to login.",
    });
  }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "User logout successfully",
          });
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: "fail to logout.",
          });
    }
}