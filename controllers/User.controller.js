import bcrypt from "@node-rs/bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

//#region Signup User

export const signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // ✅ Trim input values
    username = username.trim();
    email = email.trim().toLowerCase(); 
    password = password.trim();

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//#region Login User

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email })
      .select("+password")
      .populate("cart.product", "title price thumbnail")
      .populate("wishlist", "title price thumbnail"); 

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }
    if (!user.password) {
      throw new Error("Password not found for the user");
    }

    let hashedPassword = user.password;
    if (Buffer.isBuffer(hashedPassword) || typeof hashedPassword !== "string") {
      hashedPassword = hashedPassword.toString("utf-8");
    }

    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect email or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
  //  console.log("User :- ",user.wishlist)
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: `Welcome back ${user.username}`,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          cart: user.cart,
          address:user.address,
          wishlist: user.wishlist,
        },
        token
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

//#region Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { address } = req.body;
    console.log("id" ,id  ,"address",address )
    // Check if the address field is provided
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address field is required.",
      });
    }

    // Update the user's address and return the updated document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { address: address },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
  //  console.log("updateUser :- ",updatedUser)
    return res.status(200).json({
      success: true,
      message: "User address updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


//#region Logout

export const logout = async (req, res) => {
  try {
    // Check if user is already logged out
    if (!req.cookies.token) {
      return res.status(400).json({
        success: false,
        message: "User is already logged out.",
      });
    }

    // Clear the token cookie
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
