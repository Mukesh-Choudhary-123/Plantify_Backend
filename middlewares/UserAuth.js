import jwt from "jsonwebtoken";

const userAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "user not authenticate.",
      });
    }

    const decode = await jwt.verify(token, process.env.SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invaild token.",
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({
      success: false,
      message: "user authenticate check system failed.",
    });
  }
};

export default userAuthenticated;