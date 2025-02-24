import jwt from "jsonwebtoken";

const adminAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "admin not authenticate.",
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invaild token.",
      });
    }

    req.id = decode.adminId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      success: false,
      message: "admin authenticate check system failed.",
    });
  }
};

export default adminAuthenticated;