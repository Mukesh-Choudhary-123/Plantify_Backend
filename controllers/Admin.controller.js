import bcrypt from "@node-rs/bcrypt";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";

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

    // console.log("Email :- ", email);
    // console.log("Password :- ",password)

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
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
        },
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


//#region fetchAllSeller
export const fetchAllSeller = async (req, res) => {
  try {
    const sellers = await Seller.find({}, '_id email username isApproved');
    return res.status(200).json({
      success: true,
      message: "All Seller fetch Successfully",
      data: sellers,
    });
  } catch (error) {
    console.error("Error while fetching sellers:", error);
    return res.status(400).json({
      success: false,
      message: "Error while fetching all sellers",
    });
  }
};


//#region updateSeller
export const updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true } 
    );

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Seller approval updated successfully",
      data: updatedSeller,
    });
  } catch (error) {
    console.error("Error while updating seller:", error);
    return res.status(400).json({
      success: false,
      message: "Error while updating seller approval",
    });
  }
};
