import express from "express";
import morgan from 'morgan'
import logger from './logs/logger.js'
import dotenv from "dotenv";
import cors from 'cors'
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routes/User.routes.js";
import sellerRouter from "./routes/Seller.routes.js";
import adminRouter from "./routes/Admin.routes.js";
import productRouter from "./routes/Product.routes.js";
import cartRouter from "./routes/Cart.routes.js";
import orderRouter from "./routes/Order.routes.js";
import wishlistRouter from "./routes/Wishlist.routes.js";


const app = express();
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

dotenv.config();
connectDB();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/wishlist", wishlistRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server working on http://localhost:${port}`);
});
