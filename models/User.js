import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, 
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    address: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    cart: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 0, },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
